const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(401).json({ message: "Username and password must not be empty" });
        }
        const isAvailable = !users[username];
        if (isAvailable) {                      // hardcoding secret for simpicity
            req.session.token = jwt.sign({ username }, "token_secret", { expiresIn: 60 * 60 });
            req.session.user = { username };
            users[username] = { password };
            return res.status(200).json({ message: "Registered successfully" })
        }
        else {
            return res.status(401).json({ message: "Username is taken, choose another" });
        }
    } catch (err) {
        console.error(err)
        return res.status(401).json({ message: "Error signing up, try later" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const result = books[isbn];
    if (result)
        return res.status(200).json(result);
    return res.status(404).json({ message: `Book with ISBN ${isbn} was not found.` })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author
    const filtered = [];
    for (const i in books) {
        if (Object.hasOwnProperty.call(books, i)) {
            const book = books[i];
            if (book?.author === author) filtered.push(book);
        }
    }
    res.status(200).json(filtered);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLocaleLowerCase()
    const filtered = [];
    for (const i in books) {
        if (Object.hasOwnProperty.call(books, i)) {
            const book = books[i];
            if (book.title.toLowerCase().includes(title)) filtered.push(book);
        }
    }
    res.status(200).json(filtered);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: `Book with ISBN ${isbn} was not found.` })
    }
    res.status(200).json({ reviews: book.reviews });

});

module.exports.general = public_users;
