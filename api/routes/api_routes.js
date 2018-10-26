const router = require('express').Router();
const SHA256 = require('crypto-js/sha256');
const Cryptr = require('cryptr');
const keys = require('../config/keys');

const cryptr = new Cryptr(keys.secretCrypto);

const User = require('../models/user');
const Doctor = require('../models/doctor');
const Article = require('../models/articles');
const Diagnosis = require('../models/diagnosis');

const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(keys.sendGrid.apikey);

const newEmail =(to,surname,usrID,diagID,diagnosis,usrNme) =>{
    return {
        to: to,
        from: 'afyabora.noreply@gmail.com',
        subject: 'AfyaBora diagnosis approval request',
        text: `Dear Dr.${surname},`,
        html: `
        <p>Dear Dr.${surname},</p>
        <h1 style="font-weight:100;text-align:center;">Afya Bora Patient Diagnosis Doctor Approval</h1>
        <br/>
        <div style="text-align:center;">
        <p>\tIn order to improve data integrity,as a doctor, you are required to validate that you have diagnosed <strong>${usrNme}</strong>  with <strong>${diagnosis} </strong> by simply clicking on the link below</p>
       <br/>
        <a href="http://afya-bora.herokuapp.com/api/user/med-track/${diagID}">
        <button style="padding:15px;width:250px;background:skyblue;color:#ffffff;border:none">Validate</button>
        </a>
        </div>
        `,
    }
}


// new user registration
router.post('/user',(req,res)=>{
    // hash password before saving to db
    let password = SHA256(req.body.password+keys.salt)
    User.findOne({email:req.body.email}).then(user=>{
        if(!user){
            new User({
                password:password,
                email:req.body.email,
                mobile:req.body.mobile,
                nationalID:req.body.nationalID,
                insuarance:req.body.insuarance,
                firstName:req.body.fname,
                lastName:req.body.lname,
                gender:req.body.gender,
                weight:req.body.weight,
                height:req.body.height,
                bloodGroup:req.body.bloodgroup
            }).save().then(newUser=>{
                res.status(200).json({
                    'user':{
                         'id':newUser._id ,
                         'email':newUser.email,
                         'firstName':newUser.firstName,
                         'lastName':newUser.lastName,
                         'nationalID':newUser.nationalID,
                         'insuarance':newUser.insuarance,
                         'gender':newUser.gender,
                         'weight':newUser.weight,
                         'height':newUser.height
                    } 
                })
            }).catch(err=>{
                console.log('failed to add new user added to db',err);
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
            let newDiagnosis = new Diagnosis({
                userID:req.params.id,
                diagnosis:cryptr.encrypt(req.body.diagnosis),
                symptoms:cryptr.encrypt(req.body.symptoms),
                dosage:cryptr.encrypt(req.body.dosage),
                center:cryptr.encrypt(req.body.center),
                date:new Date(),
                docID:req.body.docID,
                confirmed:false
            })
           newDiagnosis
            newDiagnosis.save()
                .then(newRecord=>{
                Doctor.findOne({docID:newRecord.docID}).then((doc)=>{
                        sgMail.send(newEmail(doc.email,doc.surname,user.id,newRecord.id,req.body.diagnosis,user.firstName))
                 })
                
            res.status(200).json({})
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
    }).catch(err=>{
        console.log(err)
        res.status()
    })
})

// validate a diagnosis
router.get('/user/med-track/:diagnosisID',(req,res)=>{
    Diagnosis.findByIdAndUpdate(req.params.diagnosisID,
        {$set:{'confirmed':true}}
    ).then(record=>{
        res.render('validated')
    }).catch(err=>{
        res.redirect('http://google.com')
    })
})

// fetch a users record
router.get('/user/:id/med-track',(req,res)=>{
    
    Diagnosis.find({$and:
        [{userID:req.params.id},{confirmed:true}]},{_id:0,__v:0,userID:0,symptoms:0,docID:0,confirmed:0}).then(record=>{
    
      record.forEach(function(part,index){
          record[index].diagnosis =cryptr.decrypt(record[index].diagnosis) ;
          record[index].dosage = cryptr.decrypt( record[index].dosage);
          record[index].center = cryptr.decrypt( record[index].center);
      })
        res.status(200).json({record})
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            'error':err
        })
    })
})

 // register new doctor
router.post('/doctor',(req,res)=>{
    new Doctor({
        surname:req.body.surname,
        email:req.body.email,
        docID:req.body.nationalID
    }).save().then(doc=>{
         res.status(200).json('OK');
    }).catch(err=>{
        res.status(500)
        console.log(err);
    })
 })

// fetch all doctors
router.get('/doctor',(req,res)=>{
    Doctor.find({},{_id:0,__v:0}).then(doctors=>{
        res.status(200).json({
            'data':doctors
        })
    })
})

// fetch all articles
router.get('/article',(req,res)=>{
    Article.find({},{__v:0,_id:0}).then(articles=>{
        res.status(200).json({articles})
    }).catch(err=>{
        res.status(500).json({err})
    })
})

// add new article
router.post('/article',(req,res)=>{
    new Article({
        title:req.body.title,
        url:req.body.url,
        thumb:req.body.thumb
    }).save().then(newArticle=>{
        res.status(200).json({})
    }).catch(err=>{
        res.status(500).json({err})
    })
})

module.exports = router;