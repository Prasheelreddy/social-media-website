const Post=require('../models/posts');
const User=require('../models/user');

//console.log('in home  controller');
module.exports.home= async (req,res)=>{
    //console.log(req);
    // Post.find({},(err,posts)=>{
    //     //console.log(posts);
    //     return res.render('home',{
    //         posts:posts
    //     });
    // });
    try{
        let posts=await Post.find({}).populate('user').sort('-createdAt')
        .populate({
            path:'comments',
            options: { sort:'-createdAt'},
            populate:{
                path:'user'
            },
            populate: {
                path: 'likes'
            }
        }).populate('comments')
        .populate('likes');
        
        //  console.log(posts);

        let users=await User.find({});

        return res.render('home',{
            posts:posts,
            all_users:users
        });

    }
    catch(err){
        console.log('Error',err);
    }
    
}