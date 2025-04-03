const http = require('http');
const url = require('url');
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files like CSS & JS

// Session handling
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Serve login page at "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Temporarily disable SQL functionality
app.post('/login', (req, res) => {
    res.json({ success: false, message: "SQL is not set up yet." });
});

// Start server
app.listen(80, () => {
    console.log("Server running on port 3000");
});
