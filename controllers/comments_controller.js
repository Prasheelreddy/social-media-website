const Comment = require('../models/comments');
const Post = require('../models/posts');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create = async function(req, res){
    try{
        let post=await Post.findById(req.body.post);
        // console.log(post);

        if (post){
            //console.log('comments',req.body.content,req.body.post,req.user_id);
            let comment=await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
                // handle error
                //console.log(comment);
                post.comments.push(comment);
                post.save();

                comment = await comment.populate('user', 'name email').execPopulate();
                //  commentsMailer.newComment(comment);
                let job=queue.create('emails',comment).save((err)=>{
                    if(err){
                        console.log('error in creaing queue',err);
                        return;
                    }
                    console.log('job enqueued',job.id);
                });

                if(req.xhr){

                    
                    return res.status(200).json({
                        data:{
                            comment: comment
                        },
                        msg:"comment created"
                    })
                }

                return res.redirect('/');
        }
    }
    catch(err){
        console.log(`Error ${err}`);
        return;
    }
    
};



module.exports.destroy= async (req,res)=>{
   // console.log(req.params.id);
   try{
        let comment=await Comment.findById(req.params.id);

        if(comment.user==req.user.id){

            let postId=comment.post;

            comment.remove();

            let post=await Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}});
           
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            if (req.xhr){
            
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "comment deleted"
                });
            }
            
            req.flash('success', 'Comment deleted!');
            
            return res.redirect('back');
        }
        else{
            req.flash('error', 'Unauthorized');

            return res.redirect('back');
        }
   }
   catch(err){
    console.log(`Error ${err}`);
    return;
   }
    
}