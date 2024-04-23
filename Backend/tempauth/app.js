const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://de-vote1.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Database connection
mongoose.connect('mongodb+srv://temp:temp123@jwt-auth.iow4rvc.mongodb.net/De-vote')
    .then(() => {
        console.log('Connected to the database successfully!');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => console.error(err));

// Routes
app.use(authRoutes);

// Error handling for unsupported routes
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});
