const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require('axios');



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const newUser = { username, password };
  users.push(newUser);

  return res.status(201).json({ message: "User registered successfully", user: newUser });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const booksJSON = JSON.stringify(books);
  return res.status(200).json(booksJSON);
});

// Get the book list available in the shop using axios
/*regd_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://api-url/'));
    const booksJSON = JSON.stringify(response.data);

    return res.status(200).json(booksJSON);
  } catch (error) {
    console.error('Error fetching books data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });

 // Get book details based on ISBN using axios
 /*regd_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Fetch the book data for the provided ISBN from the server
    const response = await axios.get(`http://api-url/${isbn}`);

    // If the book data exists, return it as JSON response
    return res.status(200).json(response.data);
  } catch (error) {
    // If an error occurs or the book is not found, handle it
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      console.error('Error fetching book data:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});*/
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const authorBooks = Object.values(books).filter(book => book.author === author);

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get book details based on author using axios
/*regd_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    // Fetch all books from the server
    const response = await axios.get('http://api-url'); 
    const books = response.data;

    // Filter books by the provided author
    const authorBooks = Object.values(books).filter(book => book.author === author);

    if (authorBooks.length > 0) {
      // If books by the author are found, return them as JSON response
      return res.status(200).json(authorBooks);
    } else {
      // If no books by the author are found, return a 404 response
      return res.status(404).json({ message: "Books by this author not found" });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching books data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const book = Object.values(books).find(book => book.title === title);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//
/*regd_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    // Fetch all books from the server
    const response = await axios.get('http://api-url');
    const books = response.data;

    // Find the book with the provided title
    const book = Object.values(books).find(book => book.title === title);

    if (book) {
      // If the book is found, return it as a JSON response
      return res.status(200).json(book);
    } else {
      // If the book is not found, return a 404 response
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching books data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const reviews = books[isbn].reviews;

    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
