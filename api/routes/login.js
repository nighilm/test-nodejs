const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const conn = require('../../conn');

const router = express.Router();


router.post('/login' ,async (req , res ,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const sql = 'SELECT username,password FROM login WHERE email = ? ';
    //OR username = ?
    conn.query(sql, [email] , async (err, result) => {
        if (result == null){
            res.status(400).json({
                message: 'User not found!'
            });
        } 
        try {
            if (await bcrypt.compare(password, result[0].password)) {
                res.status(200).json({
                    message: 'Login Successfull!',
                    welcome: `${result[0].username}`
                });
                console.log(result[0].username);
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

module.exports = router;