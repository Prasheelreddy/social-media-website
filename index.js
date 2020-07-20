const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const port=8000;
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');


app.use(express.urlencoded());

app.use(cookieParser());

//static files
app.use(express.static('./assets'));

//layouts
app.use(expressLayouts);

//set up individual styles for views
app.set('layout extractStyles',true);
app.set('layout extractScripts ',true);


//set up ejs
app.set('view engine','ejs');
app.set('views','./views');

//use express router
app.use('/',require('./routes'));



app.listen(port,(err)=>{
    if(err){
        console.log(`error at port:${port}`);
    }else{
        console.log(`server runnig at port:${port}`);
    }
})