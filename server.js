const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
// Get the data in req.body
app.use(express.json({ extended: false}));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Search for .env otherwise listen on port 5000
const PORT = process.env.PORT || 5000;

// Pass PORT, and once it connects do a callback to console
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));