const config = require("../config/config");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;

mongoose.connect(config.mongoose.url);

let UserSchema = mongoose.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    availableTests: [{
        filename: String,
        solutions: [{
            date: Date,
            progress: Number
        }]
    }],
    isAdmin: Boolean
});

let User = module.exports = mongoose.model("User", UserSchema);


/**
 * Добавление в базу данных нового пользователя
 * @param newUser {Object} - данные о новом пользователе
 * @param callback {Function} - функция обратного вызова
 */
module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};


/**
 * Получить пользователя из базы данных по email
 * @param email {string} - email, по которому ведется поиск
 * @param callback {Function} - функция обратного вызова
 */
module.exports.getUserByEmail = (email, callback) => {
    let query = { email: email };
    User.findOne(query, callback);
};


/**
 * Получить пользователя из базы данных по id
 * @param id {String} - идентификатор, по которому ведется поиск
 * @param callback {Function} - функция обратного вызова
 */
module.exports.getUserById = (id, callback) => {
    User.findOne(ObjectId(id), callback);
};


/**
 * Сравнивает переданный пароль с паролем из базы данных
 * @param candidatePassword {string} - сравниваемый пароль
 * @param hash {string} - хэш пароля из базы данных
 * @param callback {Function} - функция обратного вызова
 */
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            throw err;
        }
        callback(null, isMatch);
    });
};


/**
 * Устанавливает пользователю новый пароль в базе данных
 * @param user {Object} - пользователь, пароль которого будет обновлен
 * @param callback {Function} - функция обратного вызова
 */
module.exports.setNewPassword = (user, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            let query = { email: user.email };
            User.update(query, { password: hash }, callback);
        });
    });
};


/**
 * Получает всех пользователей из базы данных
 * @param callback {Function} - функция обратного вызова
 */
module.exports.getUsers = callback => {
    User.find(callback);
};