const express = require('express')
const app = express();

const errorMiddleWare = require('./midleware/errors');

app.use(express.json());


// Import all routes
const users = require('./routes/users')
const products = require('./routes/product')

app.use('/api/v1',products)
app.use('/api/v1',users)

// Middleware to handle errors
app.use(errorMiddleWare)
module.exports = app