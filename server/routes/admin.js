const express = require('express');
const router = express.Router();

const Post = require('../models/post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
//get - admin

router.get('/admin',function(req,res){
    try{
        const locals ={
            title: 'Admin',
            description: 'Admin page',
        }
        res.render('admin/index',{locals,layout: adminLayout});
    }
    catch(error){
        console.log(error);
    }
})     

//post - admin

router.post('/admin', async (req,res)=>{
    try{
        const {username, password} = req.body;

        
        res.redirect('/admin')
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
            res.status(201).json({message:'User created ',user});
            
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






module.exports = router;