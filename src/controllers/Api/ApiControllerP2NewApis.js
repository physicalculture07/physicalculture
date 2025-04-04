const TestSeries = require("../../models/TestSeriesNewModel");
const Test = require("../../models/TestModel");
const Question = require("../../models/QuestionModel");
const UserPurchase = require("../../models/UserPurchaseTest");
const UserTestAttempt = require("../../models/UserTestAttemptModel");
const apiResponse = require("../../helpers/apiResponse");


// List all test series

// List all test series
exports.getAllTestSeries = async (req, res) => {
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

// Get all tests for a particular test series
exports.getTestsBySeries = async (req, res) => {
    try {
        const tests = await Test.find({ seriesId: req.params.seriesId });
        if (tests.length > 0) {
            return apiResponse.successResponseWithData(res, "Test list.", tests);
        } else {
            return apiResponse.notFoundDataSucessResponse(res, "Tests list not found");
        }
        // res.json(tests);
    } catch (err) {
        // res.status(500).json({ error: "Server Error" });
        return apiResponse.ErrorResponse(res, err);
    }
};



// Start a test (only if purchased or free)
exports.startTest = async (req, res) => {
    const { userId } = req.body;
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
exports.getTestQuestions = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        res.json({ 
            totalMarks: test.totalMarks, 
            passingMarks: test.passingMarks, 
            negativeMarking: test.questions.some(q => q.negativeMarks > 0),
            data: test.questions.map(q => ({
                question: q.text,
                options: q.options.map(o => o.text),
                correctAnswer: q.options.find(o => o.isCorrect)?.text
            }))
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

// Submit test and calculate score
exports.submitTest = async (req, res) => {
    const { userId, responses } = req.body;
    try {
        const test = await Test.findById(req.params.testId);
        if (!test) return res.status(404).json({ error: "Test not found" });

        let totalScore = 0;
        const questionResults = [];

        for (const response of responses) {
            const question = test.questions.find(q => q._id.equals(response.questionId));
            if (!question) continue;

            const selectedOption = question.options.find(opt => opt.text === response.selectedOption);
            const isCorrect = selectedOption ? selectedOption.isCorrect : false;

            totalScore += isCorrect ? question.marks : -question.negativeMarks;

            questionResults.push({
                questionId: response.questionId,
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