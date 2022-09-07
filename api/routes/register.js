const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const conn = require('../../conn');

const router = express.Router();

router.post('/', async (req , res ,next ) => {
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
                   errorMessage: 'Username or Email id already exists...',
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
        });
    }
});


module.exports = router;