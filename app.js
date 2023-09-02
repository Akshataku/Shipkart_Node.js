const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = "mongodb://127.0.0.1:27017/shipkart"


const productRoutes = require('./api/routes/products');
const customerRoutes = require('./api/routes/customers');
const orderRoutes = require('./api/routes/orders');

// mongoose.connect('mongodb+srv://akshat_garg_07:'+ process.env.MONGO_ATLAS_PW +'@cluster0.acgi0kx.mongodb.net/?retryWrites=true&w=majority');
mongoose.connect(url,{})
.then(result=>console.log("database connected"))
.catch(err=>console.log(err))


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//hnadling CORS error 
//cross origin resource sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods',
        'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({})
    }
    next();
});

//routes which should handle requests
app.use('/products',productRoutes);
app.use('/customers',customerRoutes);
app.use('/orders',orderRoutes);

//when upper 2 routes are not able to handle
//then below code will handle errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
//handles forwaded errors and other errors also.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//lets you export modules
//to use in another parts of application 
module.exports = app;