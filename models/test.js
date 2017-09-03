const config = require("../config/config");
const mongoose = require("mongoose");


const TestSchema = mongoose.Schema({
    tests: [{
        filename: String,
        name: String,
        description: String,
        questions: [{
            type: String,
            question: String,
            answers: [{
                isRight: Boolean,
                answer: String
            }],
            answer: String
        }]
    }]
});

let Test = module.exports = mongoose.model("Test", TestSchema);
