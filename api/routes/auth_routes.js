const router = require('express').Router();
const passport = require('passport');

router.get('/google',passport.authenticate('google',{
    scope:['profile']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    res.json('logged in')
})

router.get('/logout',(req,res)=>{
    // handle with passport
    req.logout();
    res.json('logged out')
    //redirect 
})

module.exports = router;