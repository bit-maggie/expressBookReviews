const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User registered." });
    } else {
      return res.status(404).json({ message: "User already exists." });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let getAllBooks = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books) {
        resolve(books);
      } else {
        reject("Unable to retrieve books");
      }
    }, 3000);
  });

  getAllBooks
    .then((allbooks) => {
      res.send(JSON.stringify(allbooks, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    })
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let getBookISBN = new Promise((resolve, reject) => {
    setTimeout(() => {
      let book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(`Unable to retrieve book with ISBN: ${isbn}`);
      }
    }, 1000);
  });

  getBookISBN
    .then((book) => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = decodeURIComponent(req.params.author).toLowerCase();

  let getBooksAuthor = new Promise((resolve, reject) => {
    setTimeout(() => {
      // getting all books with given author 
      let matches = []
      Object.keys(books).forEach(isbn => {
        const book = books[isbn];
        if (book.author.toLowerCase() === author) {
          matches.push({ isbn, ...book });
        }
      });

      if (matches.length > 0) {
        resolve(matches);
      } else {
        reject(`Unable to find book with author: ${author}`);
      }
    }, 1000);
  });

  getBooksAuthor
    .then((matches => {
      res.send(JSON.stringify(matches, null, 4));
    }))
    .catch((error) => {
      res.status(404).json({ message: error });
    });

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = decodeURIComponent(req.params.title).toLowerCase();

  let getBooksTitle = new Promise((resolve, reject) => {
    setTimeout(() => {
      let matches = []
      Object.keys(books).forEach(isbn => {
        const book = books[isbn];
        if (book.title.toLowerCase() == title) {
          matches.push({ isbn, ...book });
        }
      });

      if (matches.length > 0) {
        resolve(matches);
      } else {
        reject(`Unable to find book with title: ${title}`);
      }
    }, 1000);
  });

  getBooksTitle
    .then((matches) => {
      res.send(JSON.stringify(matches, null, 4));
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
