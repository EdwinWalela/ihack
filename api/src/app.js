// Dependancies
const express = require('express');
const mongoose = require('mongoose');
//Config
const keys = require('../config/keys');
// API routes
const api_routes = require('../routes/api_routes');
const auth_routes = require('../routes/auth_routes');

const app = express();
const port = process.env.PORT || 3000


mongoose.connect(keys.mongo.URI,{useNewUrlParser:true}).then(()=>{
    console.log('successfully connected to database')
}).catch(err=>{
    console.log('unable to connect to database: ',err)
})

app.use(express.urlencoded({extended:true}));
app.use('/auth',auth_routes);
app.use('/api',api_routes);

app.get('/',(req,res)=>{
    res.json('welcome home!')
})

app.listen(port,()=>{
    console.log(`listening to requests on port ${port}`);
})