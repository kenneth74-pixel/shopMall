const Order = require('../model/order');
const Product = require('../model/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../midleware/catchAsyncError');


// create a new order => /api/v1/order/new
exports.newOrder = catchAsyncError (async (req, res, next)=>{
    const {
        orderItems,
        shippinginfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentinfo,
        
    } = req.body;

    const order = await Order.create({ 
        orderItems,
        shippinginfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentinfo,
        paidAt:Date.now(),
        user:req.user._id,
    })

    res.status(200).json({
        success: true,
        order
    })
})

// Get single Order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncError (async (req, res,next)=>{
    const order = await Order.findById(req.params.id).populate('user','name', 'email')

    if(!order){
        return next(new ErrorHandler('No order found with this id'));
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get logged in user Order => /api/v1/order/me
exports.myOrder = catchAsyncError (async (req, res,next)=>{
    const order = await Order.find({user: req.user.id})

    res.status(200).json({
        success: true,
        order
    })
})

//Get all Orders => /api/v1/admin/order
exports.allOrder = catchAsyncError (async (req, res,next)=>{
    const order = await Order.find()

    let totalAmount = 0;
    order.forEach(order => {
        totalAmount +=order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

//Update / porocess Orders => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError (async (req, res,next)=>{
    const order = await Order.findById(req.params.id);

    if(order.status === 'Delivered'){
        return next(new ErrorHandler('you have already delivered this order'));
    }

    order.orderItems.forEach(async item =>{
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
        totalAmount,
        order
    })
})

async function updateStock(id, quantity) {
    const product = await products.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete Order => /api/v1/order/:id
exports.deleteOrder = catchAsyncError (async (req, res,next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new ErrorHandler('No order found with this id'));
    }

    await order.remove()

    res.status(200).json({
        success: true,
        order
    })
})
