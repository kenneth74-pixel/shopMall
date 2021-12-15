const User = require("../model/users");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../midleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

const crypto = require("crypto");

// register a user => api/v1/users
exports.registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "products/wmoa49q9e70ze9xtcra2",
      url: "https://res.cloudinary.com/bookit/image/upload/v1606293153/products/wmoa49q9e70ze9xtcra2.jpg",
    },
  });
  sendToken(user, 200, res);
});

// Login User => /a[i/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // check if the email and password is entered correctly by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // finding user in the database
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // Check if Password correct or not
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// Forgot Password reset
exports.forgotPassword = catchAsyncError(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
    
  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\n If you have not requested this email, then ignore it.`

  try {

      await sendEmail({
          email: user.email,
          subject: 'Ob Light Password Recovery',
          message
      })

      res.status(200).json({
          success: true,
          message: `Email sent to: ${user.email}`
      })

  } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorHandler(error.message, 500))
  }

})

// Reset Password  => /api/v1/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {

  // Hash URL token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({ 
    resetPasswordToken,
    resetPasswordExpires: { $gt:Date.now() }
  })
  if(!user){
    return next(new ErrorHandler("Password reset token is invalid or expired",400))

  }
  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Password does not match",400))
  }

  // set up new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;


  await user.save();

  sendToken(user, 200, res);
})

// Get currently loged in user details => /api/v1/me 
exports.getUserProfile = catchAsyncError (async (req, res,next)=>{
  const user = await User.findById(req.user.id);

  res.status(200).json({ 
    success: true,
    user
  })
})

// Update/ Change Password  => /api/v1/password/update

exports.updatePassword = catchAsyncError (async (req, res,next) => {

  const user = await User.findById(req.user.id).select('+password');

  // Check Old Password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if(!isMatched){
    return next(new ErrorHandler('Old password is incorrect',400))
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user,200,res)

})

// Update user profile  => /api/v1/me/update
exports.updateProfile = catchAsyncError (async (req, res, next) =>{
  const newUserData = {
    name:req.body.name,
    email:req.body.email
  }

  // update avatar TODO

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new: true,
    runValidators:true,
    useFindAndModify:true
  })

  res.status(200).json({
    success: true,
  })
}) 

// Logout user => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Admin Routes

// Get all users = /api/v1/admin/users
exports.allUsers = catchAsyncError (async (req, res,next) => {
  const user = await User.find();

  res.status(200).json({
    success: true,
    user
  })
})


// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError (async (req, res,next) => {
  const user = await User.findById(req.params.id);

  if(!user) {
    return next(new ErrorHandler(`User is not found with this id:${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user
  })

})

// Update user profile  => /api/v1/admin/user/:id
exports.updateUser = catchAsyncError (async (req, res, next) =>{
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    roles:req.body.roles
  }


  const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
    new: true,
    runValidators:true,
    useFindAndModify:true
  })

  res.status(200).json({
    success: true,
  })
})

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError (async (req, res,next) => {
  const user = await User.findById(req.params.id);

  if(!user) {
    return next(new ErrorHandler(`User is not found with this id:${req.params.id}`));
  }

  // Remove user from cloudinary - TODO

  await user.remove();

  res.status(200).json({
    success: true,
  })

})