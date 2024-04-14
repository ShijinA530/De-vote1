const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration to allow multiple origins and handle preflight requests
const allowedOrigins = ['http://localhost:5173', 'https://de-vote1.vercel.app'];
app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                      'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}));

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
