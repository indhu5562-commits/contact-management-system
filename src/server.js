const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: "/home/workspace/my-project/.env"
});

const Contact = require('./models/contact');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Contact Management System");
});

// CREATE CONTACT
app.post("/contacts", async (req, res) => {
    try {
        const contact = new Contact(req.body);
        const savedContact = await contact.save();

        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET ALL CONTACTS
app.get("/contacts", async (req, res) => {
    try {
        const contacts = await Contact.find();

        res.json(contacts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET CONTACT BY ID
app.get("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// UPDATE CONTACT
app.put("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json(contact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE CONTACT
app.delete("/contacts/:id", async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: "Contact not found"
            });
        }

        res.json({
            message: "Contact deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// START SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// MONGODB CONNECTION
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });