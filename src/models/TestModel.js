// var mongoose = require("mongoose");

// var Schema = mongoose.Schema;

// var TestSchema  = new Schema({
//     seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeriesNew", required: true },
//     title: { type: String, required: true },
//     duration: { type: Number, required: true }, // in minutes
//     totalMarks: { type: Number, required: true },
//     createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// module.exports = mongoose.model("Test", TestSchema);


const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            option: { type: String, required: true },
            isCorrect: { type: Boolean, required: true }
        }
    ],
    marks: { type: Number, required: true },
    negativeMarks: { type: Number, default: 0 }
});

const TestSchema = new mongoose.Schema({
    seriesId: { type: mongoose.Schema.Types.ObjectId, ref: "TestSeries", required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    duration: { type: Number, required: true }, // in minutes
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    questions: [QuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model("Test", TestSchema);
