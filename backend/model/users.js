const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


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
    if(this.isModified('password')) {
        next();
    }
    this.password =await bcrypt.hash(this.password,10);
})

module.exports = mongoose.model('User',userSchema)