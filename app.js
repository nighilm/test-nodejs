const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const conn = require('./conn');
const app = express();

const loginRoutes = require('./api/routes/login');
const registerRoutes = require('./api/routes/register')


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
app.use(bodyParser.raw());  


app.use('/user', registerRoutes);
app.use('/user', loginRoutes);


app.use((req ,res ,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});  
 
app.use((error ,req ,res ,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });  
});

module.exports = app;