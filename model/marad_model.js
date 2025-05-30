const mongoose = require('mongoose')

const mardSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            
        },
        typeName: {
            type: String,
        
        },
        userId:{
            type:String,
        },
        address:{
           type:String
        },
        longtitude:{
            type:Number
        },
        latitude:{
            type:Number
        },
        notes:{
            type:String
        },
        img:{
            type:String
        },
        status:{
            type:String,
            default:"pending"
        }
    },
    
    { timestamps: true }
);

const Mard = mongoose.model("Mard", mardSchema);
module.exports = {Mard}
