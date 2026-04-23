import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) =>
  jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: {
    id: user._id.toString(),
    _id: user._id,
    name: user.name,
    email: user.email
  }
});

export const registerUser = async (req, res, next) => {
  try {
    const name = req.body?.name?.trim();
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
};
