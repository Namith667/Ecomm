// ecohub-backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,       // Use the new URL parser
  useUnifiedTopology: true,  // Use the new Server Discovery and Monitoring engine
  //useCreateIndex: true,       // This option is no longer supported, but it might not cause an error
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Use Authentication Routes
app.use('/auth', authRoutes);

// Other routes and middleware can be added here...

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
