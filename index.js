const express = require('express');
//const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
// var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');
const flash=require('connect-flash');
const customMware=require('./config/middleware');

 //chat server
 const chatServer=require('http').Server(app);
 const chatSockets=require('./config/chat_sockets').chatSockets(chatServer);
 chatServer.listen(5000);
 console.log('chat server is listening on port 5000');
 

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle: 'expanded',
    prefix:'/css'

}));

app.use(express.urlencoded());
app.use(express.json()); 

//app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);




// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use(session({
    name: 'codeial',

    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled',
    },(err)=>{
        console.log(err ||'connect-mongodb setup ok');
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

//upload path
app.use('/uploads',express.static(__dirname+'/uploads'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
