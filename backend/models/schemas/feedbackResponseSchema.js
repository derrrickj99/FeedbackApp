const { Schema, default: mongoose } = require("mongoose");

const FeedbackResponseSchema = new Schema({
    questionId: mongoose.ObjectId,
    response: {},
})

module.exports = FeedbackResponseSchema