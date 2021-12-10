const products = require('../model/product')

// create new product => /api/v1/new

exports.newProduct = async(req,res,next) =>{
    const product = await products.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
}

// Get all products => /admin/api/v1/products
exports.getProducts = async(req,res,next) =>{

    const products = await products.find();


    res.status(200).json({
        success:true,
        count:products.length,
        products
    })
}

// Get product details => /admin/api/v1/:id
exports.getSingleProduct = async(req, res, next) =>{
    const product = await product.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product not found'
        })
    }

    res.status(200).json({
        success:true,
        product
    })
}

// Update roduct => /admin/api/v1/product/:id
exports.updateProduct = async (req, res) => {
    let product = await products.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product not found'
        })
    }

    product = await products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
}

// Delete products => /api/v1/admin/products/:id
exports.deleteProduct = async (req, res) => {
    const product = await products.findById(req.params.id);

    if(!product){
        return res.status(404).json({
            success:false,
            message: 'Product not found'
        })
    }

    await products.remove();

    res.status(200).json({
        success:true,
        message: 'Product successfully removed'

    })
}