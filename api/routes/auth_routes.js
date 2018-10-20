const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const User = require('../models/user');
const keys = require('../config/keys')

router.post('/login',(req,res)=>{
    User.findOne({email:req.body.email}).then(user=>{

        let password = SHA256(req.body.password+keys.salt);
        let passwordHash = user.password;
        
        if(password == passwordHash){
            user.password = null;
            res.status(200).json({
                'msg':'OK',
                'user':user
            })
        }else{
            res.status(404).json({
                'msg':'incorrect login details'
            })
        }
    }).catch(err=>{
        res.status(500).json(err)
    })
})

module.exports = router;