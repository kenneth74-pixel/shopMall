const Product = require('../model/product')
const doenv =require('doenv')
const connectDatabase = require('../config/database')

const Product = require('../data/product.json')
const product = require('../model/product')


//  setting dotenv file
dotenv.coonfig({  path: 'backend/config/config.env' })

const seedProduct = async() =>{
    try{
        await product.deleteMany();
        console.log('products are deleted');
        await product.insertMany(products)
        console.log('all products are added.');
        process.exit();
    } catch(e){
        console.log(error.message);
        process.exit();
    }
}

seedProduct()