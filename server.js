require('dotenv').config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");                                //inbuild module
const mongoose = require("mongoose");
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

//mongoose config
mongoose.connect("mongodb://localhost:27017/pizzaDB", { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;   
connection.once('open' ,()=>{
    console.log("MongoDB connection successful");
});
 
//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: "mongodb://localhost:27017/pizzaDB"                   //storing session in our mongodb collection called sessions.
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24}       //24 hours
}))

app.use(flash());

//global middleware
app.use((req,res,next) =>{                                //this code is used so that values inside session can be accessed by other files also.
    res.locals.session = req.session;
    next();
});

//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, '/resources/views')); 
app.set('view engine', 'ejs');

//set routes
require('./routes/web')(app);

app.listen(port, ()=>{ 
    console.log(`port ${port} running...`)
});