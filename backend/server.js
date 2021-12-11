const app = require("./app")
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

// Handle uncaugth exceptions 
process.on('uncaughtException',err => {
    console.log(`ERROR:${err.message}`);
    console.log('Shutting down due to uncaugth exception');
    process.exit(1);
})
 
// setting up config file
dotenv.config({ path:'backend/config/config.env' })




// connecting to the Database
connectDatabase();

const Server = app.listen(process.env.PORT, () =>{
    console.log(`Server started on PORT:${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

// Handle unhandle promise rejections
process.on('unhandledRejection',err => {
    console.log(`ERROR:${err.Message}`);
    console.log('Shutting down the server due to unhandled promise rejections');
    Server.close(() => {
        process.exit(1);
    });
})
