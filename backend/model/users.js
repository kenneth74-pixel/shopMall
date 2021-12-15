const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,'Please enter your name'],
    maxlength:[30,'your name can not exceed 30 characters']
},
email:{
    type:String,
    required:[true,'Please enter your email address'],
    unique:true,
    validate:[validator.isEmail, 'please enter a valid email']
},
password:{
    type:String,
    required:[true,'Please enter your password'],
    minilength:[6,'your password can not exceed 30 characters'],
    select:false,
},
avatar:{
    public_id:{
        type:String,
        rquals:true,
    },
    url:{
        type:String,
        required:true,
    }
},
role:{
    type:String,
   default:'user'
},
createdAt:{
    type:Date,
    default:Date.now 
},
resetPasswordToken: String,
resetPasswordExpires: Date,
})

// Encrpting password before saving
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

// compare User password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

// Return JWT Token 
userSchema.methods.getJwtToken = function (){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_TIME
});
}

//  Generate password resetToken
userSchema.methods.getResetPasswordToken = function (){
    // generate Token

    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set Token expire time
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000

    return resetToken;
}

module.exports = mongoose.model('User',userSchema)