const { Message } = require('@material-ui/icons')
const { privateDecrypt } = require('crypto')
const mongoose = require('mongoose')

const productschema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true,
        maxlength:[100, 'please enter product name'],
    },
    price:{
        type: String,
        required:true,
        maxlength:[10, 'product price can not exceed 10 charracters'],
        default:0.00
    },
    description:{
        type:String,
        required: true,
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:[true,'please select category for this product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:'Please select correct category for this product'
        }
    },  
    seller:{
        type:String,
        required:[true,'Please enter product seller']
    },
    stock:{
        type:Number,
        required:[true,'Please enter product stock'],
        maxlength:[6,'Product name can not exceed 6 characters'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
               type:Number,
               required:true 
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('product',productschema)