var mongoose = require("mongoose");

// const UserTestAttemptSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, required: true },
//     testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
//     questions: [{
//         questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
//         selectedOption: { type: mongoose.Schema.Types.ObjectId }, // Stores selected option ID
//         isCorrect: { type: Boolean }
//     }],
//     totalScore: { type: Number, default: 0 },
//     startedAt: { type: Date, default: Date.now },
//     completedAt: { type: Date }
// });

// module.exports = mongoose.model("UserTestAttempt", UserTestAttemptSchema);

const UserTestAttemptSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
    questions: [
        { questionId: mongoose.Schema.Types.ObjectId, selectedOption: String, isCorrect: Boolean }
    ],
    totalScore: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("UserTestAttempt", UserTestAttemptSchema);