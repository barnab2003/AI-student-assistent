require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Base Diagnostic Route
app.get('/', (req, res) => res.send('API running smoothly.'));

// Route Mountpoints
// Note: You will need to implement standard registration/login inside auth.js to produce tokens.
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/roadmap', require('./routes/roadmap'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server actively running on port ${PORT}`));