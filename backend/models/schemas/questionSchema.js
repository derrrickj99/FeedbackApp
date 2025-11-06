const { Schema } = require("mongoose");

const QuestionSchema = new Schema({
    text: String,
    type: String,
});

module.exports = QuestionSchema;