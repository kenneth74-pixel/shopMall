const express = require('express')
const app = express();

 const cookieParser = require('cookie-parser')

const errorMiddleWare = require('./midleware/errors');

app.use(express.json());
app.use(cookieParser());


// Import all routes
const users = require('./routes/users')
const products = require('./routes/product')

app.use('/api/v1',products)
app.use('/api/v1',users)

// Middleware to handle errors
app.use(errorMiddleWare)
module.exports = app