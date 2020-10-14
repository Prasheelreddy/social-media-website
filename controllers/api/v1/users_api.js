const User=require('../../../models/user');
const jwt=require('jsonwebtoken');


module.exports.createSession=async (req,res)=>{
    try{
        let user=await User.findOne({email:req.body.email});

        if(!user || user.password!=req.body.password){
            return res.status(422).json({
                message:'Invalid username/password'
            })
        }
        
        return res.status(200).json({
            message:'Sign in successful',
            data:{
                token:jwt.sign(user.toJSON(),'social',{expiresIn:'100000'})
            }

        })

    }
    catch(err){
        console.log('error',error);
        return res.status(500).json({
            message:'Internal server error'
        });
    }

}