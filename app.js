const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

// connect to database..
mongoose.connect('mongodb://localhost:27017/todo')
    .then(()=>{
        console.log(`mongoDB Connected.. 
        jwtSecureKey: ${config.get('jwtSecureKey')}`);
    })
    .catch((err)=> console.error(err));

// app routes
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const toDoRouter = require('./routes/todo');
const userProfile = require('./routes/user-profile');

// authentication middleware..
const auth = require('./middlewares/auth');


const app = express();

// middlewares..
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use( express.static('public'));
app.use('/uploads', express.static('uploads'));

// app routes middlewares..
app.use('/api/users/signup', signupRouter); // signup route
app.use('/api/users/login', loginRouter); // login route
app.use('/api/users/todo', auth, toDoRouter); // todo route
app.use('/api/users/image-profile', auth, userProfile);

app.listen(3000,()=>{
    console.log('app listening on port 3000');
}); 
