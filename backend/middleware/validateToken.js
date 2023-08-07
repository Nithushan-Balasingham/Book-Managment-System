const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if(authHeader && authHeader.startsWith("Bearer")){
      token = authHeader.split(" ")[1]
      const use =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
          if(err){
            return("Expired")
          }
          req.user = decoded.user
          next();
        
      })
      if(use=="Expired"){
          return res.send({status:"error", data:"Token Expired"})
      }
  }
})
module.exports = validateToken;