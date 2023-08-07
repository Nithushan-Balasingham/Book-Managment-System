const asyncHandler = require("express-async-handler")
const User = require("../models/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Tok = require('../models/token')
const sendEmail = require("../middleware/sendEmail")
const crypto = require('crypto')
const nodemailer = require("nodemailer")
const Book = require("../models/bookmodel")


const addUser = asyncHandler(async(req,res)=>{
  try{
    console.log("User",req.body)
        const {fname,lname,email,password} = req.body
        if(!fname || !lname || !email || !password){
            res.status(400)
            throw new Error("All fields are mandatory")
        }
        const userAvailable = await User.findOne({email});
        if(userAvailable){
            res.status(400)
            throw new Error("User already registerd")
        }
        const hashedPassword = await bcrypt.hash(password,10)
        console.log("Hashed Password",hashedPassword)
        const user= await User.create({
            fname,
            lname,
            email,
            password:hashedPassword
        })
       if(user){
        res.status(201).json(user)      
          const token = await new Tok({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
          await sendEmail(user.email, "Verify Email", url);

        res
          .status(201)
          .send({ message: "An Email sent to your account please verify" });
          }else{
            res.status(400);
            throw new Error("User is not valid")
          }
      }catch(error){
        console.log(error)
      }
    })

    const getUserToken = asyncHandler(async (req, res) => {
      try {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
          const user = await User.findOne({ _id: req.params.id });
          if (!user) return res.status(400).send({ message: "Invalid link" });
    
          const token = await Tok.findOne({
            userId: user._id,
            token: req.params.token,
          });
          if (!token) return res.status(400).send({ message: "Invalid link" });
    
          await User.updateOne({ _id: user._id }, { verified: true });
          await token.deleteOne();
    
          res.status(200).send({ message: "Email verified successfully" });
        }
      } catch (error) {
        console.error("Internal Server Error:", error);

        res.status(500).send({ message: "Internal Server Error", error });
      }
    });
    

    const loginUser = asyncHandler(async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          const accessToken = jwt.sign(
            {
              user: {
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                id: user.id,
                role:user.role
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30m" }
          );
          if(user.isAdmin===false){
            res.status(200).send({ message: "Already Verified" ,accessToken,user,ad:user.role});
          }
          if (user.verified===true) {
             res.status(200).send({ message: "Already" ,accessToken,user,ad:user.role, uid:user._id});
          }else{
            let token = await Tok.findOne({ userId: user._id });
    
            if (!token) {
              token = await new Tok({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();
    
              const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
              await sendEmail(user.email, "Verify Email", url);
            }
          }
        } else {
          res.status(401).json({ message: "Incorrect email or password" });
        }
      } catch (error) {
        console.log(error);
      }
    });
    

const currentUser = asyncHandler(async(req,res)=>{
            res.json(req.user.email)
        })
  
        
const validToken = asyncHandler(async(req,res,next)=>{
            let token;
            let authHeader = req.headers.Authorization || req.headers.authorization;
            if(authHeader && authHeader.startsWith("Bearer")){
                token = authHeader.split(" ")[1]
                const use =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
                    if(err){
                      return("Expired")
                    }
                    req.user = decoded.user
                    res.json({email:req.user.email,fname:req.user.fname,err,id:req.user.id,role:req.user.role})
                    next();
                    return decoded
                  
                })
                if(use=="Expired"){
                    return res.send({status:"error", data:"Token Expired"})
                }
            }
        })
          
const resetPasword = asyncHandler(async(req,res)=>{
  try {
    const oldUser = await User.findOne({email});
    if (!oldUser){
      return res.send({status:"User Not Existed"})
    }
    const secret = process.env.ACCESS_TOKEN_SECRET + oldUser.password;
    const token = jwt.sign({email:oldUser.email, id:oldUser._id},secret,{
      expiresIn:"40m"
    })
    const link = `http://localhost:5001/api/users/reset-password/${oldUser._id}/${token}`
    console.log(link)
  } catch (error) {
    console.log(error)
  }
})   


function resetEmail({ email, OTP, emailtoUpdate,subject }) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if email exists in the database
        const user = await User.findOne({email});
        if (!user) {
          return reject({ message: "Email does not exist" });
        }
  
        const transporter = nodemailer.createTransport({
          host: process.env.HOST,
          service: process.env.SERVICE,
          port: Number(process.env.EMAIL_PORT),
          secure: Boolean(process.env.SECURE),
          auth: {
            user: process.env.USER,
            pass: process.env.PASS
          }
        });
  
        const mailConfigs={
          from: process.env.USER,
          to: email,
          subject: subject,
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>CodePen - OTP Email Template</title>
          </head>
          <body>
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
              <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                  <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Koding 101</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Koding 101. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Koding 101</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Koding 101 Inc</p>
                  <p>1600 Amphitheatre Parkway</p>
                  <p>California</p>
                </div>
              </div>
            </div>
          </body>
          </html>`,
        };
  
        transporter.sendMail(mailConfigs, function (error, info) {
          if (error) {
            console.log(error);
            return reject({ message: "An error has occurred" });
          }
          return resolve({ message: "Email sent successfully" });
        });
      } catch (error) {
        console.log(error);
        return reject({ message: "An error has occurred" });
      }
    });
  };
  
const sendMessage=(req, res) => {
    resetEmail(req.body)
  .then((response) => res.send(response.message))
  .catch((error) => res.status(500).send(error.message));
};
const updatedPassword = async (req, res, next) => {
  try {
    const email = req.params.email;
    const password = req.body.password;

    const newUser = await User.findOne({ email });
    if (!newUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    newUser.password = encryptedPassword;
    await newUser.save();

    return res.json({ Status: "Password updated successfully" });
  } catch (error) {
    console.error('Error during password update:', error);
    return res.status(500).json({ error: 'Error during password update' });
  }
};
const getAllUsers = asyncHandler(async(req,res)=>{
  const posts = await User.find()
  res.status(200).json(posts)
})          
const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('Not found');
    }
  }

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedUser);
});

const getSingelUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
     
      const user = await User.findById(id);
      
      if (!user) {
        res.status(404);
        throw new Error("Not found");
      }
      res.status(200).json(user);
    }
  });
  const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const userBooks = await Book.find({ user_id: userId });
      for (const book of userBooks) { // Reason for the loop is deleting each book one by one when  userId match book's document userId
      await Book.findByIdAndDelete(book._id);// First books will be deleted
    }
    await User.findByIdAndDelete(userId);//Second data will be deleted
  
    res.json({ message: 'User account and associated books deleted successfully.' });
  });
  
module.exports={
    addUser,
    loginUser,
    validToken,
    getUserToken,
    resetPasword,
    updatedPassword,
    sendMessage,
    getAllUsers,
    updateUser,
    getSingelUser,
    deleteUserAccount

}