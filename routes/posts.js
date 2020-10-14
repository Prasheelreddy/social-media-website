const express=require('express');
const router=express.Router();

const postController=require('../controllers/posts_controller');

const passport = require('passport');
// const { route } = require('./comments');

router.post('/create',passport.checkAuthentication,postController.create);

router.get('/destroy/:id',passport.checkAuthentication,postController.destroy);

module.exports=router;