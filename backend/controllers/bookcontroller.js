const asyncHandler = require("express-async-handler")
const Book = require("../models/bookmodel")
const jwt = require("jsonwebtoken")
const { validToken } = require("./usercontroller")



const addPost = asyncHandler(async (req, res) => {
  console.log("Post", req.body);
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400);
    return res.json({ error: "All fields are mandatory" });
  }
    try {
      const book = await Book.create({
        title,
        description,
        user_id: req.user.id,
      });
      res.status(200).json(book);
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).json({ error: "Server Error" });
    }
  });

const getBooks = asyncHandler(async (req, res) => {
  try {
    const books = await Book.find({}).populate("user_id"," fname role").lean();
    res.status(200).json(books);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ error: "Server Error" });
  }
});
const getSingleBook = asyncHandler(async(req,res)=>{
  const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const book = await Book.findById(id);
      if(!book){
        res.status(404).json("Not  Found")
      }
      if(book.user_id.toString()!== req.user.id){
        res.status(403).json("Not Authorized")
      }
      res.status(200).json(book)
    }
})
  const verifyUser = asyncHandler(async (req, res, next) => {
    try {
      let token;
      let authHeader = req.headers.authorization; 
      if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user; 
        if (req.user.role == 'user') {
          return res.status(403).json("Not Authorized");
        }
        const { id } = req.params;
        const {status } = req.body;
        const book = await Book.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
  
        if (!book) {
          return res.status(404).json({ error: 'Book not found.' });
        }
        res.json(book);
      } else {
        return res.status(401).json({ error: 'No valid authorization header found.' });
      }
    } catch (err) {
      return res.status(500).json({ error: 'Error verifying the user token.' });
    }
  });
  
  
  const getAll = asyncHandler(async (req, res) => {
    try {
      const books = await Book.find({ user_id: req.user.id });
      console.log(books)
      if(!books){
        res.status(401).json("Not Found")
      }
      res.status(200).json(books);
    } catch (err) {
      console.error("Error in getAll:", err);
  
      if (err.name === "ValidationError") {
        return res.status(400).json({ error: err.message });
      }
  
      return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  });
  
  

const updatedBook= asyncHandler(async(req,res)=>{
const id = req.params.id;
if (id.match(/^[0-9a-fA-F]{24}$/)) {
  
  const book = await Book.findById(id);
  if (!book) {
    res.status(404);
    throw new Error("Not found");
  }
  if(book.user_id.toString() !== req.user.id){
    res.status(403);
    throw new Error("User dont have access")
  }
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  )
  res.status(200).json(updatedBook)

}
})
const deleteBook= asyncHandler(async(req,res)=>{
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const book = await Book.findById(id);
    if (!book) {
      res.status(404);
      throw new Error("Not found");
    }
    if(book.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("User dont have access to delete")
    }
    await Book.deleteOne({ _id: id })
    res.status(200).json(book)
}})

module.exports={
    addPost,
    verifyUser,
    getAll,
     getSingleBook,
    getBooks,
    updatedBook,
    deleteBook
}