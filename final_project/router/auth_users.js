const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  // Filter the users array for any user with the same username
  // There should only be one user with the same name, but following the implementation of the other labs
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let matches = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return matches.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let book = books[isbn];

  // if the isbn/book exists, then add review
  if (book) {
    book.reviews[username] = req.body.review;
    console.log("Reviews after put:");
    console.log(book.reviews);
    res.status(200).json({ message: "Successfully added review" });
  } else {
    res.status(404).json({ message: `Unable to find book with isbn: ${isbn}` });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let book = books[isbn];

  // if the isbn/book exists, then delete review
  if (book) {
    delete book.reviews[username];
    console.log("Reviews after delete:");
    console.log(book.reviews);
    res.status(200).json({ message: "Successfully deleted review" });
  } else {
    res.status(404).json({ message: `Unable to find book with isbn: ${isbn}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
