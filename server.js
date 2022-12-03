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
const passport = require('passport');
const emitter = require('events');                          //inbuilt module
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
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
 
//event emitter
const eventEmitter = new emitter();             
app.set('eventEmitter', eventEmitter);               //now we can use this eventEmitter anywhere in our application   

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

//passport config
const passportInit = require('./app/config/passport');
passportInit(passport); 
app.use(passport.initialize());
app.use(passport.session());

//global middleware
app.use((req,res,next) =>{                                
    res.locals.session = req.session;           //this code is used so that values inside session can be accessed by other files such as in file layout.ejs
    res.locals.user = req.user;                 //this code is used so that values inside user can be accessed by other files such as in file layout.ejs
    next();
});
    
//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, '/resources/views')); 
app.set('view engine', 'ejs');

//set routes
require('./routes/web')(app);

const server = app.listen(port, ()=>{ 
    console.log(`port ${port} running...`)
});


//SOCKET SETUP
const io = require('socket.io')(server);
io.on('connection', (socket) =>{

    //Join
    // console.log(socket.id)
    socket.on('join', (roomName)=>{               //socket.on will recieve the 'join' event from socket.emit('join', `order_${order._id}`) which is in app.js and `order_${order._id}` is passed into roomName.
        // console.log(roomName)
        socket.join(roomName)                    //socket.join(roomName) will create a room which has the name of "roomName" 
    })
})

eventEmitter.on('orderUpdated', (data)=>{                           //here "data" is recieving values from "eventEmitter.emit('orderUpdated', {id: req.body.orderId, status: req.body.status})" which is in statusController.js
     io.to(`order_${data.id}`).emit('orderUpdated', data)          //and then this "data" is sent to "socket.on('orderUpdated', (data) =>{"  which is in app.js    
})

eventEmitter.on('orderPlaced', (data)=>{                       //here "data" is receiving values from orderController.js
    io.to('adminRoom').emit('orderPlaced', data)                //and then this "data" is sent to socket.on of file admin.js
})