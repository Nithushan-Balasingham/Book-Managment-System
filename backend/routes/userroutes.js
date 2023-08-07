const express = require("express")
const router = express.Router()

const { addUser, loginUser,getUserToken, resetPasword, updatedPassword, sendMessage, getAllUsers, updateUser, getSingelUser, deleteUser, deleteUserAccount, validToken} = require("../controllers/usercontroller")
const { addPost, verifyUser, adminVerify, getbooks, getAll } = require("../controllers/bookcontroller")
const validateToken = require("../middleware/validateToken")

router.route('/register').post(addUser)
router.route('/login').post(loginUser)
router.route('/forgot-password').post(resetPasword)
router.route('/send_recovery_email').post(sendMessage)



router.get("/current", validToken)
router.get("/allUsers", getAllUsers)


router.route("/:id").get(getSingelUser).put(updateUser).delete(validateToken,deleteUserAccount)
router.get("/:id/verify/:token/",getUserToken)
router.put('/update-password/:email',updatedPassword)





module.exports=router