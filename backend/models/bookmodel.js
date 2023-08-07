const mongoose = require("mongoose")

const bookSchema = mongoose.Schema({
    user_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",

	},
    title:{
        type:String,
        required:[true,"Please Enter the book title"]
    },
    description:{
        type:String,
        required:[true,"Please Enter the description"]
    },
    status:{
        type:String,
        enum:['approved','declined','pending'],
        default:'pending'
    }
},{
    timestamps:true
})
module.exports = mongoose.model("Book",bookSchema)