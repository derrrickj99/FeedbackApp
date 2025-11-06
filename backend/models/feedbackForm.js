const { default: mongoose } = require("mongoose");
const FeedbackFormSchema = require("./schemas/feedbackFormSchema");

const FeedbackForm = mongoose.model("FeedbackForm", FeedbackFormSchema);

module.exports = FeedbackForm;