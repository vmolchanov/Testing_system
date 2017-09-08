const config = require("../config/config");
const mongoose = require("mongoose");


const TestSchema = mongoose.Schema({
    name: {
        type: String
    },
    questionsCount: {
        type: Number
    },
    data: Array
});

let Test = module.exports = mongoose.model("Test", TestSchema);


/**
 * Добавление в базу данных нового теста
 * @param {Object} newTest - данные нового теста
 * @param {Function} callback - функция обратного вызова
 */
module.exports.addTest = (newTest, callback) => {
    newTest.save(callback);
};
