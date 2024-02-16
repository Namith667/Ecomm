// ecohub-backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register a regular user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input (add your own validation logic)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register an admin
router.post('/register-admin', async (req, res) => {
  console.log('Received admin registration request');
  try {
    const { username, email, password } = req.body;

    // Validate input (add your own validation logic)

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    // Save the admin to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route remains the same
router.post('/login', async (req, res) => {
  try {const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  console.log('Login successful:', token); // Add this line

  res.json({ token, userId: user._id, role: user.role });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});

module.exports = router;
