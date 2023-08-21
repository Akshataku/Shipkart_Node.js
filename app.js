const express = require('express');
const app = express();
const morgan = require('morgan');

// app.use('/',(req, res, next) => {
//     res.status(200).json({
//         message : 'Akshat is in his zone.'
//     });
// });

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

//routes which should handle requests
app.use('/products',productRoutes);
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