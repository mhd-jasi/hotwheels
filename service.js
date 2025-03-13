const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Serve static files from the current directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname)));

// Middleware for parsing request bodies
app.use(cors());
app.use(bodyParser.json());  // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Default XAMPP username
    password: '',  // Default XAMPP password is empty
    database: 'customercare_db'  // Your XAMPP MySQL database
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Could not connect to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'intex.html'));  // Corrected file name from 'intex.html' to 'index.html'
});

// Route for handling checkout form submissions
// Route for handling checkout form submissions
app.post('/checkout', (req, res) => {
    const { name, email, address, phone, paymentMethod, paymentDetails, products } = req.body;

    if (!name || !email || !address || !phone || !paymentMethod || !products) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const sql = `INSERT INTO orders (name, email, address, phone, payment_method, payment_details, order_items) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, email, address, phone, paymentMethod, JSON.stringify(paymentDetails), JSON.stringify(products)], (err, result) => {
        if (err) {
            console.error('Error saving checkout data:', err);
            return res.status(500).json({ message: 'Error saving data' });
        }
        
        // Send the orderId (or insertId) back in the response
        res.status(200).json({ message: 'Order placed successfully', orderId: result.insertId });
    });
});


// Route to get order details based on order ID
app.get("/order-summary/:orderId", (req, res) => {
    const { orderId } = req.params;

    // Query to fetch the order details from the database
    const sql = `SELECT * FROM orders WHERE order_id = ?`;

    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error('Error retrieving order details:', err);
            return res.status(500).json({ message: 'Error retrieving order details' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Assuming order data is in the result, send it as a response
        const order = result[0];
        order.payment_details = JSON.parse(order.payment_details);
        order.order_items = JSON.parse(order.order_items);

        res.status(200).json(order);  // Send the order details as JSON
    });
});


// Route for handling contact form submissions
app.post('/contact', (req, res) => {
    const { name, phone, email, comment } = req.body;

    console.log('Received contact form data:', { name, phone, email, comment });  // Log the received data

    // Insert data into `contacts` table (you'll need to create this table in the database)
    const sql = `INSERT INTO contacts (name, phone, email, comment) VALUES (?, ?, ?, ?)`;

    db.query(sql, [name, phone, email, comment], (err, result) => {
        if (err) {
            console.error('Error saving contact data:', err);  // Log the error
            return res.status(500).json({ message: 'Error saving contact data', error: err.message });
        }
        res.status(200).json({ message: 'Contact message submitted successfully' });
    });
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
