const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const conn = require('./conn');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 
app.use(bodyParser.raw());  




app.get('/user', (req , res , next) => {
    res.status(200).json({
        message: 'GET request working',
        user: users
    })
});


app.post('/user', async (req , res ,next ) => {
     try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);  
        console.log(salt);
        console.log(hashedPassword);  
        const user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };
        console.log(user);
        const sql = 'INSERT INTO login (username,email,password) VALUES (? ,? ,? );'
        conn.query(sql, [user.username, user.email, user.password] , (err , result) => {
            if (err) {
                res.status(400).json({
                    errorMessage: 'Error registering, try agin...',
                    error: err
                });
            } else {
                res.status(201).json({
                    message: 'User registered successfully!'
                })
            }
        })
       
       
    } catch {
        res.status(500).json({
              errorMessage: 'Error'
        })
    }
   

});

app.post('/user/login' ,async (req , res ,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = 'SELECT password FROM login WHERE email = ? ';
    conn.query(sql, [email] , async (err, result) => {
        if (result == null){
            res.status(400).json({
                message: 'User not found!'
            });
        } 
        try {
            if (await bcrypt.compare(password, result[0].password)) {
                res.status(200).json({
                    message: 'Login Successfull!'
                });
            } else {
                res.status(200).json({
                    message: '*Incorrect password*'
                }); 
            }
        } catch  {
            res.status(500).json({
                errorMessage: 'Error'
            })
        }
    })
});



module.exports = app;