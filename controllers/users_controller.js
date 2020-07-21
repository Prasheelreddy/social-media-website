const User= require('../models/user');

module.exports.profile=(req,res)=>{
    
    return res.render('user_profile');
};

module.exports.signup=(req,res)=>{
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    res.render('user_sign_up');
}

module.exports.signin=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
     }
    res.render('user_sign_in');
}

//get the sign up data

module.exports.create=(req,res)=>{
    if (req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email},(err,user)=>{
        if(err){console.log('error in finding user in sign up');return;};
        if(!user){
            User.create(req.body,(err,user)=>{
                if(err){console.log('error in finding user in sign up');return;};

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}

module.exports.createSession=(req,res)=>{
    //todo
    console.log('create session');
    return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{
    req.logout();
    return res.redirect('/');
}