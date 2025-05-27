const mongoose = require('mongoose')

const voyageSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            
        },
        productName: {
            type: String,
        
        },
        phoneNumber:{
            type:String,
            default:null
        },
        quntityPaid:{
            type:Number
        },
        quntityDisponible:{
            type:Number
        },
        tax:{
            type:Number
        },
        notes:{
            type:String
        },
        img:{
            type:String
        }
    },
    
    { timestamps: true }
);

const Voyage = mongoose.model("Voyage", voyageSchema);
module.exports = {Voyage}
