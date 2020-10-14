const passport=require('passport');
const googleStrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');
const { Strategy } = require('passport');
const { callbackify } = require('util');
const { access } = require('fs');
const { profile } = require('console');

passport.use(new googleStrategy({
        clientID:"",
        clientSecret:"",
        callbackURL:"http://localhost:8000/users/auth/google/callback",
    },
    (accessToken,refreshToken,profile,done)=>{
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in googleStrategy',err);return;}

            console.log(profile);

            if(user){
                return done(null,user);
            }else{
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                },(err,user)=>{
                    if(err){console.log('error in creating user google-strategy',err);return;}
                    return done(null,user);
                })
            }
        })
    }
))

module.exports=passport;
