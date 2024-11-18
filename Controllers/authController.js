const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/ErrorResponse");
exports.signUp = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
});
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password:
  if (!email || !password) {
    return next(new ErrorResponse("please provide and email"), 400);
  }
  ///check for the user
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return next(new ErrorResponse("wrong email or password please retry"), 401);
  }
  //check if passwords matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("wrong email or password please retry"), 401);
  }

  //create token
  sendTokenResponse(user, 200, res);
});
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
