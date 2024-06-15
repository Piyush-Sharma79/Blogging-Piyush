require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const sessions = require('express-session');



const connectDB = require('./server/config/db');
const app = express();
const PORT = process.env.PORT || 200;

connectDB();


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

app.use(sessions({
    secret: 'keyboard cat',
    resave :false,
    saveUninitialized: true,
    store : MongoStore.create({
        mongoUrl :process.env.MONGO_URI
    }),
    cookie:{maxAge : new Date(Date.now()+ 1000*60*60*24)}

}))

app.use(express.static('public'));

//Templating Engine

app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})