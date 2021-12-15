const products = require('../model/product')

const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../midleware/catchAsyncError');
const APIFeatures = require('../utils/apifeatures');



// create new product => /api/v1/new

exports.newProduct = catchAsyncError (async(req,res,next) =>{

    req.body.user = req.user.id;
    const product = await products.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
})

// Get all products => /admin/api/v1/products?keyword=headphones
exports.getProducts = catchAsyncError (async(req,res,next) =>{

    const resPerPage = 4;
    const productsCount = await products.countDocuments();

    const apiFeatures = new APIFeatures(products.find(), req.query)
        .search()
        .filter()

    let product = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage)
    


    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        product
    })

})

// Get product details => /admin/api/v1/:id
exports.getSingleProduct = catchAsyncError (async(req, res, next) =>{
    const product = await products.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('product not found',404));
    }

    res.status(200).json({
        success:true,
        product
    })
})

// Update roduct => /admin/api/v1/product/:id
exports.updateProduct = catchAsyncError (async (req, res) => {
    let product = await products.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('product not found',404));
    }

    product = await products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        product
    })
})

// Delete products => /api/v1/admin/products/:id
exports.deleteProduct = catchAsyncError (async (req, res) => {
    const product = await products.findById(req.params.id);

    
    if(!product){
        return next(new ErrorHandler('product not found',404));
    }


    await products.remove();

    res.status(200).json({
        success:true,
        message: 'Product successfully removed'

    })
})