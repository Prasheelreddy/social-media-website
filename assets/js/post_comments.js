{
    let createComment=()=>{

        document.body.addEventListener('submit',async(e)=>{
            e.preventDefault();
            console.log('inside');
            console.log(e.target);
            if(e.target.className=='comments'){
                let post_id=e.target.children[0].children[2].value;

                let comment=e.target.children[0].children[1].value;
                console.log(comment);
                try{
                    const response=await fetch('/comments/create',{
                        method:'POST',
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            'Content-Type': 'application/json',
                        },
                        body:JSON.stringify({
                            content:comment,
                            post:post_id
                        })
                    });
                    const res=await response.json();
                    console.log(res.data.comment);
                    let newComment=newCommentDOM(res.data.comment);
                    let parent=e.target.nextElementSibling;
                    parent.insertAdjacentHTML('afterbegin',newComment);
                    e.target.children[0].children[1].value='';

                    new ToggleLike($(' .toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "comment posted!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
            }
            catch(err){
                console.log('error',err);
            }
         }
        })
    }

    let newCommentDOM=(comment)=>{
        return `<div class="card border-primary mb-3" id='comment-${comment._id}'>
        <div class="card-body">
            <h4 class="card-title">
                ${comment.user.name}
                <a class="btn btn-danger" id="comment-delete" href="/comments/destroy/${comment._id }" role="button">delete</a>
    
            </h4>
            <p class="card-text">${comment.content}</p>

            <small>
                            
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                0 Likes
            </a>
                            
            </small>
        
            </div>
    </div>`
    }

    document.body.addEventListener('click',async (e)=>{
        // e.preventDefault();
        console.log(e.target.id);
        if(e.target.id=='comment-delete'){
            // console.log(e.target.getAttrssibute('href'));
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
                document.getElementById(`comment-${res.data.comment_id}`).remove();
                new Noty({
                    theme: 'relax',
                    text: "comment Deleted",
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

    createComment();
}