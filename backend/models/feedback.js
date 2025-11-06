const { default: mongoose } = require("mongoose");
const FeedbackSchema = require("./schemas/feedbackSchema");

const Feedback = mongoose.model("Feedback", FeedbackSchema);

module.exports = Feedback;