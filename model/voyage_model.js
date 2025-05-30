const mongoose = require('mongoose')

const voyageSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            
        },    
        notes:{
            type:String
        },
        voyageType:{
                type:String
        },
        address:{
                type:String
        },
        img:{
            type:String
        },
                longitutude:{
            type:Number
        },
        latitude:{
            type:Number
        },
    },
    
    { timestamps: true }
);

const Voyage = mongoose.model("Voyage", voyageSchema);
module.exports = {Voyage}
