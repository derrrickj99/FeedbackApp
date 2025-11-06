const { Schema, default: mongoose } = require("mongoose");
const FeedbackResponseSchema = require("./feedbackResponseSchema");

const FeedbackSchema = new Schema({
    _id: mongoose.ObjectId,
    formId: mongoose.ObjectId,
    responses: [FeedbackResponseSchema],
    suggestions: String,
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = FeedbackSchema