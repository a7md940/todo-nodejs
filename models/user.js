const config = require('config');
const mongoose = require('mongoose');
const joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true
    },
    password: {
        type:String,
        required: true,
        max: 1024
    },
    isAdmin: {
        type: Boolean,
        required: false,
    }
});

userSchema.methods.makeJWT = function(){
   const token = jwt.sign({
       id: this._id,
       email: this.email, 
       username: this.username
    }, config.get('jwtSecureKey'),{expiresIn: '168h'});
   return token;
}

const User = mongoose.model('user', userSchema);


function validateUser(user){
    const joiSchema = {
        username: joi.string().required().min(3).max(50),
        email: joi.string().required().email().min(5).max(50),
        password: joi.string().required().min(5).max(255)
    }
    return joi.validate(user, joiSchema);
}

exports.User = User;
exports.validateUser = validateUser;
