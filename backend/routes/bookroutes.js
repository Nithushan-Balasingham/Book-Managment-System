const express = require("express")
const router = express.Router()

const { addPost, verifyUser, adminVerify, getbooks, getAll, getSingleBook, getBooks, updatedBook, deleteBook } = require("../controllers/bookcontroller")
const validateToken = require("../middleware/validateToken")
const { deleteUser } = require("../controllers/usercontroller")

router.route('/addBook').post(validateToken,addPost)//Adding a new book
// router.route('/getBooks').get(getBooks)//Getting All Book

router.route('/book/:id').patch(verifyUser)

router.route("/:id").put(validateToken,updatedBook).delete(validateToken,deleteBook).get(validateToken,getSingleBook)


// router.get("/admin", verifyUser)
// router.get("/getAllBooks", getbooks)
router.route("/").get(validateToken,getBooks)



module.exports=router