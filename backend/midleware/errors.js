const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500;

    if(prcess.env.NODE_ENV ==='DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}

        error.message = err.message;

        // Wrong mongoose object id Error
        if(err.name == 'castError'){
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message,400)
        }

        // Handling mongoose Validation Error
        if(err.name == 'validationError'){
            const message = object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message,400)
        }


        res.status(err.statusCode).json({
            success:false,
            message:err.message || 'Internal Server Error'
        })
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.stack
    })
}