
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





        res.render('index',{locals,data,current:page,nextPage:hasnextPage?nextPage:null,currentRoute:'/'});
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


//get-post 

router.get('/post/:id',async (req,res)=>{
    try{
        
        let slug = req.params.id;
        const data = await Post.findOne({_id:slug});

        const locals = {
            title: data.title,
            description: 'This is the post page'
        }

        res.render('post',{locals,data});
    }
    catch(error){
        console.log(error);
    }
    
})



//Post - search
router.post('/search',async (req,res)=>{
    try{

        const locals = {
            title: 'Search',
            description: 'This is the post page'
        }

        let searchTerm = req.body.searchTerm;

        const searchNoSpecialCharacter = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        // const data = await Post.find({$text: { $search: searchTerm, $caseSensitive: true }});
        const data = await Post.find({
            $or:[
                {title: {$regex : new RegExp(searchNoSpecialCharacter,'i')}}, 
                {body: {$regex : new RegExp(searchNoSpecialCharacter,'i')}}
            ]
        });
        res.render('search',{locals,data});

    }
    catch(error){
        console.log(error);
    }
    
})

//get-about

router.get('/about',async (req,res)=>{
    const locals = {
        title: 'About',
        description: 'This is the about page'
    }
    res.render('about',{locals,currentRoute:/about/});    
});

//get-contact

router.get('/contact',(req,res)=>{
    const locals = {
        title: 'Contact',
        description: 'This is the contact page'
    }
    res.render('contact',{locals,currentRoute:/contact/});
});


// function insertPostData(){
//     Post.insertMany([
//         {
//             title:'Nodejs is awesome',
//             body:'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.',
//         },
//         {
//             title:'Express is awesome',
//             body:'Express.js, or simply Express, is a back end web application framework for Node.js, released as free and open-source software under the MIT License.',
//         },
//         {
//             title:'MongoDB is awesome',
//             body:'MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas.',
//         }
//     ])
// }
// insertPostData();

module.exports = router;