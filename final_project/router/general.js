const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const user = [
  { username: 'Uday', password: 'gsdjgfd' },
  { username: 'hibu', password: 'gsdjgfd' },
  { username: 'uday', password: 'abcdxyz' },
]
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(200).json({
      messga:"please provide username and password"
    })
  }
  // if(!isValid(username)){
  //   return res.status(200).json({
  //         message:"please provide a valid username"
  //   })
  // }
  for(let item of user){
    if(item.username ===username){
      return res.status(200).json({status:false,message:"Username already taken provide another"})
    }
  }
  user.push({username,password})
  console.log(user)
  return res.status(200).json({message: "User successfuly register"});
});
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  // console.log(books)
  // books = Object.keys(books).map((key)=>{
  //   return books//[key].title
  // })
  await books
  return res.status(300).json({message: "List of Available Books",books});
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  function getBookByIsbn(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error('Book not found'));
        }
      }, 1000);
    });
  }
  getBookByIsbn(isbn)
    .then(book => {
      res.status(200).json({ status: true, message: "Book details", book });
    })
    .catch(error => {
      res.status(404).json({ status: false, message: error.message });
    });
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  console.log(author);
  let booksByAuthor = Object.values(books).filter(book => book.author === author);
  return res.status(300).json({message: "books based on author",booksByAuthor});
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksByTitle = Object.values(books).filter(book => book.title === title);
  return res.status(300).json({message: "Books by title", booksByTitle});
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let rev = books[isbn].reviews
  console.log(rev);
  return res.status(200).json({reviews: rev});
});
module.exports.general = public_users;