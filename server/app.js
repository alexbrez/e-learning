const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Στατική εξυπηρέτηση των αρχείων
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.use(express.json());

const users = {
    testuser: "password123",
    alex: "12345", // Δείγμα χρήστη
};

const sessions = {}; // Αποθηκεύει τα session IDs

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (users[username] && users[username] === password) {
        const sessionId = uuidv4();
        sessions[sessionId] = username;
        return res.json({ sessionId });
    }

    res.status(401).send("Invalid username or password");
});

const carts = {}; // Αποθηκεύει τα καλάθια

app.post("/cart", (req, res) => {
    const { sessionId, itemId, itemType, title, cost } = req.body;

    if (!sessions[sessionId]) {
        return res.status(401).send("Unauthorized");
    }

    const username = sessions[sessionId];
    if (!carts[username]) {
        carts[username] = [];
    }

    const existingItem = carts[username].find(item => item.itemId === itemId);
    if (existingItem) {
        return res.status(400).send("Item already in cart");
    }

    carts[username].push({ itemId, itemType, title, cost });
    res.send("Item added to cart");
});


app.get("/cart", (req, res) => {
    const { username, sessionId } = req.query;

    if (!sessions[sessionId] || sessions[sessionId] !== username) {
        return res.status(401).send("Unauthorized");
    }

    const cart = carts[username] || [];
    const totalCost = cart.reduce((sum, item) => sum + item.cost, 0);

    res.json({ cartItems: cart, totalCost });
});

app.delete("/cart", (req, res) => {
    const { username, sessionId, itemId } = req.body;

    if (!sessions[sessionId] || sessions[sessionId] !== username) {
        return res.status(401).send("Unauthorized");
    }

    const cart = carts[username] || [];
    const itemIndex = cart.findIndex(item => item.itemId === itemId);

    if (itemIndex === -1) {
        return res.status(404).send("Item not found in cart");
    }

    cart.splice(itemIndex, 1);
    const totalCost = cart.reduce((sum, item) => sum + item.cost, 0);

    res.json({ totalCost });
});
