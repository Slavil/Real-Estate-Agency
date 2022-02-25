const mongoose = require('mongoose');

// npm i bcrypt
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    }
});
userSchema.pre('save', function(next){
    return bcrypt.hash(this.password, SALT_ROUNDS)
    .then((hash)=>{
        this.password = hash;
        return next()
    });
});

// валидация на паролата

userSchema.method('validatePassword', function(password){
    return bcrypt.compare(password, this.password)
});

const User = mongoose.model('User', userSchema);
module.exports = User;

// свързана с authServices в papka service