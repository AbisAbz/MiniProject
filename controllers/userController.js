const User= require('../Models/userModel')
const bcrypt=require('bcrypt')

let message

const securePassword= async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10)
        return passwordHash
    }catch(err){
        console.log(err.message);
    }
}


const loadRegister= async(req,res)=>{
    try{
        res.render('registration')
    }catch(err){
        console.log(err.message);
    }
}

const insertUser=async(req,res)=>{
    try{
        const spassword=await securePassword(req.body.password)
        console.log(req.body);
        const user =new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mob,
            password:spassword,
            is_admin:0,
        })

    const userData= await user.save()

    if(userData){
        res.render('registration',{message:"Your registration has been successfully completed"})
    }else{
        res.render('registration',{message:"Your registration has been failed"})
    }

    }catch(err){
        console.log(err);
    }
}

const loginLoad= async(req,res)=>{
    try{
        res.render('login',{message})
        message=null
    }catch(err){
        console.log(err.message);
    }
}

const verifyLogin= async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password

        const userData=await User.findOne({email:email})
        
        if(userData){
            const passwordMatch=await bcrypt.compare(password,userData.password);
            // if(password===userData.password){
            //     var passwordMatch=true
            // }else{
            //     passwordMatch=false
            // }
            console.log(passwordMatch);
            if(passwordMatch){
                console.log('correct');
                req.session.user_id=userData._id
                res.redirect('/home')
            }else{
                res.render('login',{message:'Email or password is incorrect'})
                console.log('incorrect');
            }
        }else{
            res.render('login',{message:'Email or password is incorrect'})
        }

    }catch(err){
        console.log(err.message);
    }
}

const loadHome=async(req,res)=>{
    try{
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home',{ user: userData })
    }catch(err){
        console.log(err.message);
    }
}

const userLogout= async(req,res)=>{
    try{
        req.session.destroy()
        res.redirect('/')
    }catch(err){
        console.log(err.message);
    }
}

module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}