const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const keys = require('../config/keys');
const User = require('../models/user');
const Diagnosis = require('../models/diagnosis');

router.get('/',(req,res)=>{
    res.json('api home')
})

// new user registration
router.post('/user',(req,res)=>{
    // hash password before saving to db
    let password = SHA256(req.body.password+keys.salt)
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            let newUser = new User({
                password:password,
                email:req.body.email,
                firstName:req.body.fname,
                lastName:req.body.lname,
                gender:req.body.gender,
                weight:req.body.weight,
                height:req.body.height,
                bloodGroup:req.body.bloodgroup
            }).save().then(newUser=>{
                res.status(200).json({
                    'id':newUser._id 
                });
            }).catch(err=>{
                console.log('failed to add new user added to db');
                res.status(500).json({'msg':err});
            })
        }else{
            res.status(500).json({'msg':'duplicate'})
        }
    })
})

// fetch a particular user 
router.get('/user/:id',(req,res)=>{
    User.findOne({_id:req.params.id}).then(user=>{
        if(user){
            res.status(200).json({
                'user':user
            });
        }else{
            res.status(404).json({
                'msg':'Not Found'
            })
        }
    }).catch(err=>{
        res.status(500).json({
            'msg':err
        })
    })
})

// update user details
router.put('/user/:id?',(req,res)=>{
    User.findOneAndUpdate(
        {_id:req.params.id},
        {$set:{'weight':req.query.weight,'height':req.query.height}}      
    ).then(user=>{
        res.status(200).json()
    }).catch(err=>{
        res.status(500).json({
            'msg':'error',
            'error':err
        }) 
    })

})

// add a new diagnosis
router.post('/user/:id/med-track',(req,res)=>{
    User.findById(req.params.id).then(user=>{
        if(user){
            new Diagnosis({
                userID:req.params.id,
                diagnosis:req.query.diagnosis,
                diagnosisID:req.query.diagnosisID,
                dosage:req.query.dosage,
                center:req.query.center,
                date:new Date(),
                docID:req.query.docID,
                confirmed:false
            }).save().then(newRecord=>{
                res.status(200).json({
                })
            }).catch(err=>{
                res.status(500).json({
                    'msg':'err',
                    'error':err
                })
            })
        }else{
            res.status(404).json({
                'msg':'User not found'
            })
        }
    })
})
//fetch a users record
router.get('/user/:id/med-track',(req,res)=>{
    Diagnosis.find({userID:req.params.id}).then(record=>{
        res.status(200).json({
            'data':record
        })
    }).catch(err=>{
        res.status(500).json({
            'error':err
        })
    })
})




module.exports = router;