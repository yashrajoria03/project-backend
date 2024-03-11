import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import randomstring from "randomstring";

import jwt from "jsonwebtoken";

const register = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ message: "User already exists" });
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
  });
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword)
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    const { password, ...otherDetails } = user;
    res.status(200).json({ otherDetails });
  } catch (err) {
    next(err);
  }
};

const googleRegister = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomstring.generate(10), salt);
  const newUser = new User({
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
  });
  try {
    await newUser.save();
    const { password, ...otherDetails } = newUser;
    console.log(newUser);
    res.status(200).json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};
const googleLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    const { password, ...otherDetails } = user;
    res.status(200).json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};

export { register, login, googleLogin, googleRegister };
