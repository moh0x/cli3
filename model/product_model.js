const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            
        },
        productName: {
            type: String,
        
        },
        userId:{
            type:String,
        },
        quantity:{
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
        },
        notes:{
            type:String
        }
    },
    
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = {Product}
