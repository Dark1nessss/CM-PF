const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const OtherPage = require('../models/OtherPage');

// Generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.status(200).json({
        id: user._id,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Fetch Favorites
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error fetching favorites' });
  }
};

// Fetch Other Pages
const getOtherPages = async (req, res) => {
  try {
      const pages = await OtherPage.find().populate('blocks');
      const response = pages.map(page => ({
          ...page.toObject(),
          subPages: page.subPages.map(sub => ({
              ...sub,
              blocks: [], // Placeholder for future expansion
          })),
      }));
      res.status(200).json(response);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

// Validation of Tokens
const validateToken = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      res.status(200).json({ message: 'Token is valid' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getFavorites, getOtherPages, validateToken };