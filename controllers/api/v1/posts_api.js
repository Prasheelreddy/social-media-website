const Post=require('../../../models/posts');

const Comment=require('../../../models/comments');


module.exports.index= async (req,res)=>{
   
    try{
        let posts=await Post.find({}).populate('user').sort('-createdAt')
        .populate({
            path:'comments',
            options: { sort:'-createdAt'},
            populate:{
                path:'user'
            }
        });
        //  console.log(posts);

        return res.status(200).json({
            message:'Lists of posts',
            posts:posts
        });

    }
    catch(err){
        console.log('Error',err);
    }
    
}

module.exports.destroy=async (req,res)=>{
    try{
        let post=await Post.findById(req.params.id);
            console.log('inside');
       if(post.user == req.user.id){
             post.remove();

            
            await Comment.deleteMany({post:req.params.id});
        
            return res.status(200).json({
                message:'post and associated comments deleted'
            });
        
        }
        else{
            return res.status(401).json({
                message:'cannot delete this post'
            })
        }
    }
    catch(err){
        // req.flash('error',err);

        console.log(`Error ${err}`);
        return res.status(500).json({
            message:'Internal server error'
        });

    }
    

}