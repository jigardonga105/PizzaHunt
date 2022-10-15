//Requiring Modules:-
require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')
const passport = require('passport');
const Emitter = require('events')
const multer = require("multer");

let dbUrl = process.env.MONGO_CONNECTION_URL;
(async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const conn = mongoose.connect(dbUrl, { useNewUrlParser: true });
            if (conn) {
                console.log('Database connection established...');
                resolve(true);
            }
        } catch (error) {
            console.log('Database connection failed...');
            reject(error);
        }
    })
})();

//event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: process.env.MONGO_CONNECTION_URL
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour 
}))

//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Assets 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Store Images
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/uploadedImages');
    },
    filename: (req, file, callback) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
            return callback(message, null);
        }

        var filename = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        callback(null, filename);
    }
});
app.use(multer({ storage: storage }).any("image"));

// Global middleware 
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)


//Server Listening
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


//===========================================================
//==========================Socket==========================
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    //join
    // console.log(socket.id);
    socket.on('join', (orderId) => {
        // console.log(orderId);
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data._id}`).emit('orderUpdated', data)
})


eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})