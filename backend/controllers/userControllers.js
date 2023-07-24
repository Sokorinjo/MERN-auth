import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check if user exists
  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    //status 401 - not authorized
    res.status(401);
    throw new Error("Invalid credentials");
    //You don't wanna let them know which one is wrong.
  }
});

//@desc Register a new user
//route POST /api/users
//@access Public
const regsiterUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if(!name || !email || !password){
    res.status(400)
    throw new Error('Please input all fields.')
  }

  if (userExists) {
    //400 - client error
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  //PASSWORD IS HASHED IN userModel.js
  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Logout user
//route POST /api/users/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged Out" });
});

//@desc Get user profile
//route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

//@desc Update user profile
//route PUT /api/users/profile
//@access Private
const UpdateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

export {
  authUser,
  regsiterUser,
  logoutUser,
  getUserProfile,
  UpdateUserProfile,
};
