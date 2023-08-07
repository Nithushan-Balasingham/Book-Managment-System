const express = require("express")
const router = express.Router()

const { addPost, verifyUser, getAll, getSingleBook, getBooks, updatedBook, deleteBook } = require("../controllers/bookcontroller")
const validateToken = require("../middleware/validateToken")

router.route('/addBook').post(validateToken,addPost)

router.route('/book/:id').patch(verifyUser)

router.route("/:id").put(validateToken,updatedBook).delete(validateToken,deleteBook).get(validateToken,getSingleBook)



router.route("/").get(validateToken,getBooks)



module.exports=router