const jwt = require('../utils/jwt')
const User = require('../models/user')
const {JWT_SECRET} = require('../constants')

exports.login = async ({username, password}) =>{
    let user = await User.findOne({username});
    if(!user){
        throw new Error ('Invalid user name or password!')
    }

    let isValid = await user.validatePassword(password);
    if(!isValid){
        throw new Error ('Invalid username or password!')
    }

    //create token
    let payload = {
        _id:user._id, 
        name: user.name, 
        username: user.username
    };

    let token = await jwt.sign(payload, JWT_SECRET) // {expiresIn: '1h'} след колко време да изтече сесията
    return token;
    
}

exports.register = (userData) => User.create(userData)
