const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret= process.env.JWT_SECRET;


//check-login

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.userId = decoded.userId;
        next();
    }
    catch(error) {
        res.status(401).json({message:'Unauthorized'});
    }
}

const adminLayout = '../views/layouts/admin';
const adminRegLayout = '../views/layouts/admin-reg';
//get - admin

router.get('/admin',function(req,res){
    try{
        const locals ={
            title: 'Admin',
            description: 'Admin page',
        }
        res.render('admin/index',{locals,layout: adminRegLayout});
    }
    catch(error){
        console.log(error);
    }
})     

router.get('/admin/register',function(req,res){
    try{
        const locals ={
            title: 'Register',
            description: 'Register page',
        }
        res.render('admin/registr',{locals,layout: adminRegLayout});
    }
    catch(error){
        console.log(error);
    }
})

//post - admin

router.post('/admin', async (req,res)=>{
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message:'Invalid credential'});
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(401).json({message:'Invalid credential'});
        }
        //create token
        const token = jwt.sign({userId:user._id},jwtSecret);

        res.cookie('token',token,{httpOnly:true});
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
});


router.get('/dashboard',authMiddleware,async function(req,res){
    try{
        const locals ={
            title: 'Dashboard',
            description: 'Dashboard page',
        }
        const data = await Post.find();  
        const user = await User.findOne({_id:req.userId});
        res.render('admin/dashoard',{locals,data,layout: adminLayout,user});
    }
    catch(error){
        console.log(error);
    }
})

router.post('/admin/register', async (req,res)=>{
    try{
        const {username, password}= req.body;
        const hashedPassword = await bcrypt.hash(password,10);
    
        try{
            const user = await User.create({ username,password:hashedPassword});
            res.send('User created');
            
        }
        catch(error){
            if(error.code === 11000){
                return res.status(409).json({message:'Username already exists'});
            }
            res.status(500).json({message:'Internal server error'});
        }
    } 


    
    catch(error){
        console.log(error);
    }
})

router.get('/add-post',authMiddleware,async function(req,res){ 
    try{
        const locals ={
            title: 'Add Post',
            description: 'Add Post page',
        }
        res.render('admin/add-post',{locals,layout: adminLayout});
    }
    catch(error){
        console.log(error);
    }
})

router.post('/add-post',authMiddleware,async function(req,res){
    try{
        const {title, body} = req.body;
        const post = new Post({title,body});
        await Post.create(post);
        res.redirect('/dashboard');
        
    }
    catch(error){
        console.log(error);
    }
})


router.put('/edit-post/:id',authMiddleware,async function(req,res){ 
    try{
        await Post.findByIdAndUpdate(req.parama.id,{
            title : req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        })
        res.redirect('admin/edit-post/${req.params.id}');
    }
    catch(error){
        console.log(error);
    }
})

router.get('/edit-post/:id',authMiddleware,async function(req,res){
    try{
        const locals={
            title:'Edit post',
            description:'edit post'
        }
        const data = await Post.findById(req.params.id);
        res.render('admin/edit-post',{locals,data,layout: adminLayout});
    }
    catch(error){
        console.log(error);
    }
})
router.post('/edit-post',authMiddleware,async function(req,res){
    try{
        const {title, body} = req.body;
        const post = new Post({title,body});
        await Post.create(post);
        res.redirect('/dashboard');
        
    }
    catch(error){
        console.log(error);
    }
})

router.delete('/delete-post/:id',authMiddleware,async function(req,res){
    try{
        await Post.deleteOne({_id:req.params.id});
        res.redirect('/dashboard');
    }
    catch(error){
        console.log(error);
    }
})


router.get('/admin/logout',authMiddleware,async (req,res)=>{
    res.clearCookie('token');
    res.redirect('/admin');
})
router.post('/liked/:id',async (req,res)=>{
    try{
        const postId = req.params.id;
        const post = await Post.findOne({_id:postId});
        post.likes +=1;
        await post.save();
        res.redirect('/');

    }
    catch(error){
        console.log(error);
    }
})


module.exports = router;