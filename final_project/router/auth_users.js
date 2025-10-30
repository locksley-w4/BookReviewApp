const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    try {
        const { username, password } = req.body;
        const success = String(users[username]?.password) === String(password);
        if (success) {                      // hardcoding secret for simpicity
            req.session.token = jwt.sign({ username }, "token_secret", { expiresIn: 60 * 60 });
            req.session.user = { username };
            return res.status(200).json({ message: "Logged in successfully" })
        }
        else {
            return res.status(401).json({ message: "Incorrect credentials, try again" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Error logging in, try later" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { username: user } = req.session.user;
    const isbn = req.params.isbn
    const { reviewMessage } = req.query;
    if (!reviewMessage) {
        return res.status(400).send("Review text must not be empty!");
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} was not found.` })
    }
    books[isbn].reviews[user] = { message: reviewMessage, user }
    res.status(200).send("Review was successfully added")
});

regd_users.delete("/auth/review/:isbn", (req, res) => { 
    const { username: user } = req.session.user;
    const isbn = req.params.isbn
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} was not found.` })
    }
    books[isbn].reviews[user] = undefined;
    res.status(200).send("Review was successfully deleted")
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
