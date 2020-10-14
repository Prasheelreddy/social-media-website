const passport=require('passport');
const JWTStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;

const User=require('../models/user');

let opts={
    jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey:'social'
}

passport.use(new JWTStrategy(opts,(jwtPayLoad,done)=>{
    User.findById(jwtPayLoad._id,(err,user)=>{
        if(err){console.log('error in jwt user find');return;}

        if(user){
            return done(null,user);
        }else{
            return done(null ,false);
        }
    })
}));

module.exports=passport;