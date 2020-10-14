
{
    let createPost=()=>{
        const newPostForm=document.getElementById('new-post-form');

        newPostForm.addEventListener('submit',async (e)=>{
            e.preventDefault();
            console.log(document.getElementById('message').value);
            // const data=new FormData(newPostForm);
            try{
                // console.log(JSON.stringify(req.body.content));
                const response=await fetch('/posts/create',{
                    method:'POST',
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        content:document.getElementById('message').value
                    })
                });
                const res=await response.json();
                console.log(res);
                let newPost=newPostDOM(res.data.post,res.data.user); 
               
                let postList= document.getElementById('posts-list-container');
               
                postList.insertAdjacentHTML('afterbegin',newPost);
                
                
               // console.log(res.data.post);
                document.getElementById('message').value='';

                new ToggleLike($(' .toggle-like-button', newComment));
                
                new Noty({
                    theme: 'relax',
                    text: "Post published!",
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                    
                }).show();

            }
            catch(err){
                console.log('error',err);
            }
            

        })
    }

    let newPostDOM=(post,user)=>{
        output=
            `<div class="card my-3" id="post-${post._id}">
            <div class="card-header">
                 POST
                <a class="btn btn-danger delete-post" href="/posts/destroy/${post._id}" role="button">delete</a>
            </div>
            <div class="card-body">
                <h4 class="card-title">Name :${user}</h4>
                <p class="card-text">${post.content} </p>

                <small>

                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                    </a>
                
                </small>                

                <div class="card-footer text-muted">
                        <form action="/comments/create" id="post-${post._id}-comments-form" class="comments" method="POST">
                            <div class="form-group">
                                <label for="content">add comment</label>
                                <input class="form-control" name="content" type="text" id="comment" placeholder="Type here to add commment" required>
                                <input type="hidden" name="post" value="${post._id}">
                                <input class="btn btn-success my-3" id="comment-submit" type="submit" value="add comment">
                            </div>
                        </form>
                    <div class="post-comments-${post._id}">
                        
                    </div>
                </div>
            </div>
        </div>`;
        return output;
    }


    // let deletePost=(deletelink)=>{
        // let ele=document.getElementsByClassName('delete-post');
        document.body.addEventListener('click',async (e)=>{
            if(e.target.className.includes('delete-post')){
                console.log(e.target.getAttribute('href'));
                e.preventDefault();

                try{
                    const response=await fetch(e.target.getAttribute('href'),{
                        method:'GET',
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                        }
                    });
                    const res=await response.json();
                    // console.log(res);
                    document.getElementById(`post-${res.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }
                catch(err){
                    console.log('Error',err);
                }
            }
            

        });
    // }

    createPost();
}