const TestSeries = require("../../models/TestSeriesNewModel");
const Test = require("../../models/TestModel");
const Question = require("../../models/QuestionModel");
const UserPurchase = require("../../models/UserPurchaseTest");
const UserTestAttempt = require("../../models/UserTestAttemptModel");
const apiResponse = require("../../helpers/apiResponse");
const jwt = require("jsonwebtoken");
//65.2.10.177


// List all test series

// List all test series
exports.getAllTestSeries_old = async (req, res) => {
    try {
        
        const series = await TestSeries.find();
        if (series.length > 0) {
            return apiResponse.successResponseWithData(res, "Test series list.", series);
        } else {
            return apiResponse.notFoundDataSucessResponse(res, "Test series list not found");
        }
        // res.json(series);
    } catch (err) {
        // res.status(500).json({ error: "Server Error" });
        return apiResponse.ErrorResponse(res, err);
    }
};

exports.getAllTestSeries = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.decode(token);
        const userId = decoded._id;

        const allSeries = await TestSeries.find();

        const result = await Promise.all(allSeries.map(async (series) => {
            let isFree = series.isFree;

            // If not free, check if user has purchased
            if (!isFree) {
                const purchase = await UserPurchase.findOne({
                    seriesId: series._id,
                    userId,
                    paymentStatus: "Completed" // Optional, if you want to ensure only paid purchases count
                });

                if (purchase) {
                    isFree = true; // User has purchased, treat as free
                }
            }

            return {
                _id: series._id,
                title: series.title,
                description: series.description,
                image: series.image,
                price: series.price,
                isFree, // Overridden value
            };
        }));

        if (result.length > 0) {
            return apiResponse.successResponseWithData(res, "Test series list.", result);
        } else {
            return apiResponse.notFoundDataSucessResponse(res, "Test series list not found");
        }
    } catch (err) {
        console.error("Error in getAllTestSeries:", err);
        return apiResponse.ErrorResponse(res, err);
    }
};

// Get all tests for a particular test series
exports.getTestsBySeries = async (req, res) => {
    console.log("gettestByseries");
    
    try {
        const tests = await Test.find({ seriesId: req.params.seriesId });
        if (tests.length > 0) {
            // console.log(tests);

            // Set negativeMarks to 1 if not defined
            const updatedTests = tests.map(test => {
                const updatedQuestions = test.questions.map(q => ({
                    ...q.toObject?.() || q, // handle Mongoose documents safely
                    negativeMarks: q.negativeMarks !== undefined ? 1 : 1,
                }));

                return {
                    ...test.toObject?.() || test,
                    questions: updatedQuestions,
                };
            });
            
            return apiResponse.successResponseWithData(res, "Test list.", updatedTests);
        } else {
            return apiResponse.notFoundDataSucessResponse(res, "Tests list not found");
        }
        // res.json(tests);
    } catch (err) {
        console.log(err);
        
        // res.status(500).json({ error: "Server Error" });
        return apiResponse.ErrorResponse(res, err);
    }
};



// Start a test (only if purchased or free)
exports.startTest = async (req, res) => {
    const { userId } = req.body;
    console.log("sdfsdf");
    
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        const testSeries = await TestSeries.findById(test.seriesId);
        if (!testSeries) return res.status(404).json({ error: "Test series not found" });

        // Check if the test series is free or purchased
        const hasAccess = testSeries.isFree || 
            (await UserPurchase.findOne({ userId, seriesId: test.seriesId }));

        if (!hasAccess) {
            return res.status(403).json({ error: "Access denied. Purchase required." });
        }

        res.json({ message: "Test started", test });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Buy a test series
exports.buyTestSeries = async (req, res) => {
    const { userId } = req.body;
    try {
        const series = await TestSeries.findById(req.params.seriesId);
        if (!series) return res.status(404).json({ error: "Test series not found" });

        if (series.isFree) {
            return res.json({ message: "This test series is free, no purchase needed." });
        }

        // Check if already purchased
        const alreadyPurchased = await UserPurchase.findOne({ userId, seriesId: series._id });
        if (alreadyPurchased) return res.json({ message: "Already purchased." });

        await UserPurchase.create({ userId, seriesId: series._id });
        res.json({ message: "Purchase successful" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Get test questions
exports.getTestQuestions_old = async (req, res) => {
    console.log("sdfsdfdsfsd--", req.params);
    
    try {
        const test = await Test.findById(req.params.testId).lean();
        console.log(test);
        
        if (!test) return res.status(404).json({ error: "Test not found" });
        
        return apiResponse.successResponseWithData(res, "Test list.", test);

    } catch (err) {
        console.log(err);
        
        res.status(500).json({ error: "Server Error" });
    }
};

exports.getTestQuestions = async (req, res) => {
    console.log("Fetching test questions for:", req.params);

    try {
        const test = await Test.findById(req.params.testId).lean();

        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }

        // Format questions
        const formattedQuestions = test.questions.map(q => ({
            _id: q._id.toString(),
            questionId: q._id.toString(),
            question: q.question,
            options: q.options,
            marks: q.marks,
            negativeMarks: 1//q.negativeMarks,
        }));

        return apiResponse.successResponseWithData(res, "Test questions list.", {
            ...test,
            questions: formattedQuestions,
        });

    } catch (err) {
        console.error("Error fetching test:", err);
        return res.status(500).json({ error: "Server Error" });
    }
};


// Submit test and calculate score
exports.submitTest123 = async (req, res) => {
    const { userId, responses } = req.body;
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        let totalScore = 0;
        const questionResults = [];

        for (const response of responses) {
            const question = test.questions.find(q => q._id.equals(response.question_id));
            if (!question) continue;

            const selectedOption = question.options.find(opt => opt.text === response.selectedOption);
            const isCorrect = selectedOption ? selectedOption.isCorrect : false;

            totalScore += isCorrect ? question.marks : -question.negativeMarks;

            questionResults.push({
                question_id: response.question_id,
                selectedOption: response.selectedOption,
                isCorrect
            });
        }

        await UserTestAttempt.create({
            userId,
            testId: test._id,
            questions: questionResults,
            totalScore,
            completedAt: new Date()
        });

        res.json({ 
            message: "Test submitted successfully", 
            totalMarks: test.totalMarks,
            passingMarks: test.passingMarks,
            negativeMarking: test.questions.some(q => q.negativeMarks > 0),
            data: questionResults
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.submitTest11111 = async (req, res) => {
    const { userId, testId, examresponse } = req.body;
    try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        let totalScore = 0;
        const questionResults = [];

        for (const response of examresponse) {
            const question = test.questions.find(q => q._id.equals(response.question_id));
            if (!question) continue;

            let isCorrect = false;

            if (response.action === 'submitted' && response.selected_option_id) {
                const selectedOption = question.options.find(opt => opt._id.equals(response.selected_option_id));
                isCorrect = selectedOption ? selectedOption.isCorrect : false;
                totalScore += isCorrect ? question.marks : -question.negativeMarks;
            }
            else if (response.action === 'skipped') {
                // No marks for skipped question
            }

            questionResults.push({
                question_id: response.question_id,
                selected_option_id: response.selected_option_id,
                action: response.action,
                isCorrect: response.action === 'skipped' ? null : isCorrect
            });
        }

        await UserTestAttempt.create({
            userId,
            testId: test._id,
            questions: questionResults,
            totalScore,
            completedAt: new Date()
        });

        res.json({ 
            message: "Test submitted successfully", 
            totalMarks: test.totalMarks,
            passingMarks: test.passingMarks,
            negativeMarking: test.questions.some(q => q.negativeMarks > 0),
            data: questionResults
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
};

// exports.submitTest = async (req, res) => {
//     const { userId, testId, examresponse } = req.body;
    

//     try {
//         const test = await Test.findById(testId);
//         if (!test) return res.status(404).json({ error: "Test not found" });

//         let totalMarksObtained = 0;
//         let correctAnswers = 0;
//         let incorrectAnswers = 0;
//         let skippedQuestions = 0;
//         const answers = [];

//         for (const response of examresponse) {
//             const question = test.questions.find(q => q._id.equals(response.question_id));
//             if (!question) continue;

//             let isCorrect = false;

//             if (response.action === 'submitted' && response.selected_option_id) {
//                 const selectedOption = question.options.find(opt => opt._id.equals(response.selected_option_id));
//                 isCorrect = selectedOption ? selectedOption.isCorrect : false;

//                 if (isCorrect) {
//                     correctAnswers++;
//                     totalMarksObtained += question.marks;
//                 } else {
//                     incorrectAnswers++;
//                     totalMarksObtained -= question.negativeMarks;
//                 }
//             } else if (response.action === 'skipped') {
//                 skippedQuestions++;
//             }

//             answers.push({
//                 questionId: response.question_id,
//                 selectedOptionId: response.selected_option_id || null,
//                 action: response.action,
//                 status: response.action === 'skipped' ? 'skipped' : 'submitted'
//             });
//         }

//         await UserTestAttempt.create({
//             userId,
//             testId: test._id,
//             questions: answers,
//             totalScore: totalMarksObtained,
//             completedAt: new Date()
//         });

//         return apiResponse.successResponseWithData(res, "Result ", {
//             userId,
//             Total_Questions: test.questions.length,
//             Correct_Answers: correctAnswers,
//             Incorrect_Answers: incorrectAnswers,
//             Skipped_Questions: skippedQuestions,
//             Total_Marks_Obtained: totalMarksObtained,
//             answer: answers
//         });

//         res.json();

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server Error" });
//     }
// };

exports.submitTest = async (req, res) => {
    const testId = req.params.testId;
    const {
        Total_Questions,
        Correct_Answers,
        Incorrect_Answers,
        Skipped_Questions,
        Total_Marks_Obtained,
        answer
    } = req.body;

    console.log(req.body)

    try {
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ error: "Test not found" });
        }
        const token = req.headers.authorization;
        const decoded = jwt.decode(token);
        const userId = decoded._id;

        // const userId = req.user?.id || req.body.userId; // Assuming you have user ID from auth or body

        await UserTestAttempt.create({
            userId,
            testId: test._id,
            questions: answer.map(ans => ({
                questionId: ans.questionId,
                selectedOptionId: ans.selectedOptionId || null,
                action: ans.action,
                status: ans.status
            })),
            totalScore: Total_Marks_Obtained,
            allData: req.body,
            completedAt: new Date()
        });

        return apiResponse.successResponseWithData(res, "Test submitted successfully", {
            userId,
            Total_Questions,
            Correct_Answers,
            Incorrect_Answers,
            Skipped_Questions,
            Total_Marks_Obtained,
            answer
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server Error" });
    }
};
