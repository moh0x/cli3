const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema(
    {
        email:{type: String,},
        password:{type: String,},
        token:{type:String},
        username:{
            type: String,
            
        },
        userWork: {
            type: String,
            required: true,
    
        },
        userWorkName: {
            type: String,
          
          
        },
        nif: {
            type: String,
           
        
        },
        phoneNumber:{
            type:String,
            default:null
        },
        numberOfNif:{
            type:String,
            required:true,
        },
        typeOfProduit:{
            type:String,
            required:true,
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
        longitutude:{
            type:Number
        },
        latitude:{
            type:Number
        },
        notes:{
            type:String
        },
        adress:{
            type:String
        }
    },
    
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
module.exports = {Client}
