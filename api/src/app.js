// Dependancies
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
//Config
const keys = require('../config/keys');
const passportSetup = require('../config/passport-setup');
// API routes
const auth_routes = require('../routes/auth_routes');

const app = express();
const port = process.env.PORT || 3000


mongoose.connect(keys.mongo.URI,{useNewUrlParser:true}).then(()=>{
    console.log('successfully connected to database')
}).catch(err=>{
    console.log('unable to connect to database: ',er)
})

app.use(express.urlencoded({extended:true}));
app.use(cookieSession({
    maxAge:24*60*60*1000,
    keys:[keys.cookieKey]
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',auth_routes);

app.get('/',(req,res)=>{
    res.json('welcome home!')
})

app.listen(port,()=>{
    console.log(`listening to requests on port ${port}`);
})