const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/socialmedia_development',{useNewUrlParser:true});

const db=mongoose.connection;

db.on('error',console.error.bind(console,"Error  connecting to db"));

db.once('open',()=>{
    console.log('Connected to database');
});

module.exports=db;