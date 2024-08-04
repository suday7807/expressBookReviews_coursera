const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [
  { username: 'Uday', password: 'gsdjgfd' },
  { username: 'hibu', password: 'gsdjgfd' },
  { username: 'uday', password: 'abcdxyz' },
];
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if(username==="string"){
  return true
}else{
  return false
}
}
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
for(let item of users){
  if(item.username ===username &&  item.password ===password){
    return true
  }
}
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(200).json({
      message:"please provide username and password"
    })
  }

  let result = authenticatedUser(username,password)
  if(!result){
    return res.status(200).json({
      message:"User details does not exist, register first"
  })
  }
  let token = jwt.sign({username,password},"MYSECRETKEY")
  return res.status(200).json({status:true,message: "Login successful", token});
});
// Add a book review
regd_users.put("/auth/review/:isbn",(req, res) => {
  //Write your code here
  console.log("HIT");
  let isbn = req.params.isbn;
  console.log("isbn", isbn);
  let token = req.headers.authorization;
  if (!token) {
    return res.status(200).json({
      status: false,
      message: "Login first"
    });
  }
  token = token.split(" ")[1];
  console.log("token", token);
  let decoded;
  try {
    decoded = jwt.verify(token, "MYSECRETKEY");
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid token"
    });
  }
  console.log("decoded", decoded);
  let username = decoded.username;
  let review = req.body.review;
  if (!review) {
    return res.status(400).json({
      status: false,
      message: "Review content is required"
    });
  }
  if (!books[isbn]) {
    return res.status(404).json({
      status: false,
      message: "Book not found"
    });
  }
  books[isbn].reviews[username] = review;
  console.log("books", books);
  return res.status(200).json({
    status: true,
    message: "Review added or updated successfully",
    reviews: books[isbn].reviews
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  console.log("isbn", isbn);
  let token = req.headers.authorization;
  if (!token) {
    return res.status(200).json({
      status: false,
      message: "Login first"
    });
  }
  token = token.split(" ")[1];
  console.log("token", token);
  let decoded;
  try {
    decoded = jwt.verify(token, "MYSECRETKEY");
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid token"
    });
  }
  console.log("decoded", decoded);
  let username = decoded.username;
  if (!books[isbn]) {
    return res.status(404).json({
      status: false,
      message: "Book not found"
    });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      status: false,
      message: "Review not found"
    });
  }
  delete books[isbn].reviews[username];
  console.log("books", books);
  return res.status(200).json({
    status: true,
    message: "Review deleted successfully",
    reviews: books[isbn].reviews
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;