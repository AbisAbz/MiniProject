const express= require('express')
const user_route=express()
const session=require('express-session')
const nocache = require('nocache');
const config=require('../config/config')


const auth=require('../middleware.js/auth')

// const cors=require('cors')

user_route.use(nocache());
user_route.set('view engine','ejs')
user_route.set('views','./views/user')

const bodyParser=require('body-parser')
user_route.use(bodyParser.json())
// user_route.use(cors());
user_route.use(bodyParser.urlencoded({ extended: true }))
// const path=require('path')
user_route.use(session({
    secret: config.sessionSecret, // Change this to a secure value in production
    resave: false,
    saveUninitialized: false
  }));

const userController=require('../controllers/userController')

user_route.get('/register',auth.isLogout,userController.loadRegister)

user_route.post('/register',userController.insertUser)

user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)

user_route.post('/login',userController.verifyLogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

module.exports=user_route;