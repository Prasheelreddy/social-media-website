const Post =require('../models/posts');
const Comment=require('../models/comments');
const Like = require('../models/like');

module.exports.create=async (req,res)=>{
    console.log(req.body.content);
    try{
        let post=await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        // console.log(post._id);
        let user=await Post.findById(post._id).populate('user');
        // console.log(user);
        console.log(req.xhr);
        if(req.xhr){
            req.flash('success','Post published');
            return res.status(200).json({
                data:{
                    post,
                    user:user.user.name
                },
                msg:"post created"
            })
        }
        
        return res.redirect('back');
    }
    catch(err){
        req.flash('error',err);
        console.log(`ERror ${err}`);
        return res.redirect('back');
    }
    

}

module.exports.destroy=async (req,res)=>{
    try{
        let post=await Post.findById(req.params.id);

        if(post.user == req.user.id){

            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            post.remove();

            await Comment.deleteMany({post:req.params.id});
            if(req.xhr){
                req.flash('success','Post deleted');
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    msg:"post deleted"
                })
            }
           

            return res.redirect('back');
        
        }
        else{
            req.flash('error','Post cannot be deleted');

            return res.redirect('back');
        }
    }
    catch(err){
        req.flash('error',err);

        console.log(`Error ${err}`);
        return res.redirect('back');
    }
    

}