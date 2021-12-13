const User = require('../model/users')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../midleware/catchAsyncError')


// register a user => api/v1/users
exports.registerUser = catchAsyncError(async(req,res) =>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'products/wmoa49q9e70ze9xtcra2',
            url:'https://res.cloudinary.com/bookit/image/upload/v1606293153/products/wmoa49q9e70ze9xtcra2.jpg'
        }

    })

    res.status(201).json({
        success: true,
        user
    })
})