// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});

// Define a schema for storing contact messages
const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    message: String,
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);

// Define API endpoint for contact form
app.post('/contact', async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;
    
    try {
        // Save the form data to MongoDB
        const newContact = new Contact({ firstName, lastName, email, phone, message });
        await newContact.save();
        res.json({ code: 200, message: 'Message saved successfully' });
    } catch (error) {
        res.json({ code: 500, message: 'An error occurred while saving the message' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
