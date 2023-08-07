const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        required:[true,"Please Enter the First Name"]
    },
    lname:{
        type:String,
        required:[true,"Please Enter the Last Name"]
    },
    email:{
        type:String,
        required:[true,"Please Enter the Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter the Password"]
    },
    verified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
},{
    timestamps:true
})
module.exports = mongoose.model("User",userSchema)