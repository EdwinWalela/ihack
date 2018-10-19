const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');
const keys = require('../config/keys');


passport.serializeUser((user,done)=>{
    done(user.id);
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        done(null,user);
    })
})

passport.use(new GoogleStrategy({
    // options for the google strategy
    clientID:keys.google.clientID,
    clientSecret:keys.google.clientSecret,
    callbackURL:'/auth/google/redirect'
},(accessToken,refreshToken,profile,done)=>{
    User.findOne({googleId:profile.id}).then(isUser=>{
        if(!isUser){
            new User({
                username:profile.displayName,
                googleId:profile.id,
                thumbnail:profile._json.image.url,
            }).save().then(newUser=>{
                console.log('new user added')
                done(null,newUser)
            })
        }else{
            done(null,isUser)
            console.log('user exists')
        }
    })
}))