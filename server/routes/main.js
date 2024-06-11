
const express = require('express');
const router = express.Router();

const Post = require('../models/post');

//get-home


router.get('/', async(req,res)=>{
    
    try{
        const locals = {
            title: 'Home',
            description: 'This is the home page'
        }


        let prPage = 9;
        let page = req.query.page ||1;
//pagination important
        const data = await Post.aggregate([{$sort:{createdAt:-1}}])
        .skip(prPage*page - prPage)
        .limit(prPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page)+1;
        const hasnextPage = nextPage <= Math.ceil(count/prPage);





        res.render('index',{locals,data,current:page,nextPage:hasnextPage?nextPage:null});
    }catch(error){
        console.log(error);
    }

    
});


// router.get('/', async(req,res)=>{
    // const locals = {
        // title: 'Home',
        // description: 'This is the home page'
    // }
    // try{
        // const data = await Post.find();
        // res.render('index',{locals,data});
    // }catch(error){
        // console.log(error);
    // }

    
// });

//get-about

router.get('/about',async (req,res)=>{
    const locals = {
        title: 'About',
        description: 'This is the about page'
    }
    res.render('about',{locals});    
});

//get-contact

router.get('/contact',(req,res)=>{
    const locals = {
        title: 'Contact',
        description: 'This is the contact page'
    }
    res.render('contact',{locals});
});


// function insertPostData(){
//     Post.insertMany([
//         {
//             title: 'Post 1',
//             body: 'This is the body of post 1'
//         },
//         {
//             title: 'Post 2',
//             body: 'This is the body of post 2'
//         },
//         {
//             title: 'Post 3',
//             body: 'This is the body of post 3'
//         }
//     ])
// }
// insertPostData();

module.exports = router;