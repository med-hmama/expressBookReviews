const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (password !== user.password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ username: user.username }, "access", { expiresIn: '1h' });

  // Set the token in the session
  req.session.authorization = { accessToken: token };

  return res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username; // Assuming the username is stored in req.user

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!Array.isArray(books[isbn]?.reviews)) {
    books[isbn].reviews = [];
  }

  const index = books[isbn]?.reviews.findIndex(r => r.username === username);

  if (index !== -1) {
    books[isbn].reviews[index].review = review;
  } else {
    books[isbn].reviews.push({ username, review });
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  const index = books[isbn]?.reviews.findIndex(r => r.username === username);

  if (index === -1) {
    return res.status(404).json({ message: "Review not found or you are not authorized to delete it" });
  }

  books[isbn].reviews.splice(index, 1);

  return res.status(200).json({ message: "Review deleted successfully" });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
