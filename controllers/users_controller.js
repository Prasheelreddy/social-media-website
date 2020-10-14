const User= require('../models/user');
const fs=require('fs');
const path=require('path');


module.exports.profile=(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        console.log(user);
        return res.render('user_profile',{
            profile_user:user
        });
    });

};

module.exports.update=async (req,res)=>{
    /*if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,(err,user)=>{
            return res.redirect('back');
        })
    }
    else{
        return res.status(401).send('unauthorized');
    }*/
    if(req.user.id==req.params.id){
        try {
            let user=await User.findById(req.params.id);
            User.uploadedAvatar(req,res,(err)=>{
                if(err) {
                    console.log("*****multer error",err);
                    return;
                }
                console.log(req.file);
                user.name=req.body.name;
                user.email=req.body.email;
                console.log('avatar',user.avatar,user.name,user.email);

                if(req.file){

                    if(fs.existsSync(path.join(__dirname,'..',user.avatar))) {
                        fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    }

                    user.avatar=User.avatarPath+'/'+req.file.filename;
                    // console.log(user.avatar);
                }
                user.save();
                return res.redirect('back');
            })
            
        } catch (error) {
            console.log('error',error);
        }

    }else{
        res.flash('error','Unauthorized');
        return res.status(401).send('unauthorized');

    }
}

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
            req.flash('error','email already exists');
            return res.redirect('back');
        }
    });
}

module.exports.createSession=(req,res)=>{
    //todo
    console.log('create session');
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession=(req,res)=>{
    req.logout();
    req.flash('success','Logged out successfully');
    return res.redirect('/');
}