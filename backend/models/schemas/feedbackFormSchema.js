const { Schema } = require("mongoose");
const QuestionSchema = require("./questionSchema");

const FeedbackFormSchema = new Schema({
    title: String,
    questions: [QuestionSchema],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isActive: {
        type: Boolean,
        default: true,
    }
})

module.exports = FeedbackFormSchema;