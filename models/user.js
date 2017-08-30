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
    }
});

let User = module.exports = mongoose.model("User", UserSchema);

module.exports.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEmail = (email, callback) => {
    let query = { email: email };
    User.findOne(query, callback);
};


module.exports.getUserById = (id, callback) => {
    User.findOne(ObjectId(id), callback);
};


module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) {
            throw err;
        }
        callback(null, isMatch);
    });
};