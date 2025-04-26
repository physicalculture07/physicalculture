var mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    question: { type: String, required: true },
    options: [{ 
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        option: { type: String, required: true }, 
        isCorrect: { type: Boolean, default: false }
    }],
    marks: { type: Number, required: true },
    negativeMarks: { type: Number, default: 0 }
});

module.exports = mongoose.model("Question", QuestionSchema);
