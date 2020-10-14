const nodemailer=require('../config/nodemailer');

exports.newComment=(comment)=>{
    console.log('inside newComment mailer');
    // console.log(comment)
    let htmlString=nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs')
    let mailOptions={
        from:'sai181047sai@gmail.com',
        to:comment.user.email,
        subject:'New Comment',
        html:htmlString
    }
    console.log(mailOptions);
    nodemailer.transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('Message sent',info);
        return;
    });
}
