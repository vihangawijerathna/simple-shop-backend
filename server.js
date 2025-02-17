// server.js - Part 1
require('dotenv').config();
const express = require('express');  //A web framework for Node.js that makes it easy to create web servers and APIs
const mysql = require('mysql2');  //Allows our Node.js application to communicate with MySQL database
const cors = require('cors');  //Enables Cross-Origin Resource Sharing (allows our frontend to communicate with backend)

const app = express();

// Middleware
app.use(cors());  // Enable CORS for all routes
app.use(express.json());  // Parse JSON bodies

// Database connection
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Create our first API endpoint
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Add this new endpoint to your server.js
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id;
    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(results[0]);
    });
});

// Start the server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});

