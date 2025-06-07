const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username:{
			type: String,
			
		},
		email: {
			type: String,
			required: true,
	
		},
		password: {
			type: String,
			required: true,
			minLength: 8,
		},
		phoneNumber: {
			type: String,
			default:null,
		
		},
		token:{
			type:String,
			default:null
		},
        role:{
            type:String,
            required:true,
            maxlength:10,
			enum:['eng',"cli","admin"]
        },
		        longitutude:{
            type:Number
        },
        latitude:{
            type:Number
        },
		address:{
            type:String
        },
	},
	
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = {User}
