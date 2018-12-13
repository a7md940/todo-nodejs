const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


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

// authentication middleware..
const toDoAuth = require('./middlewares/auth');


const app = express();

// middlewares..
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app routes middlewares..
app.use('/api/users/signup', signupRouter); // signup route
app.use('/api/users/login', loginRouter); // login route
app.use('/api/users/todo', toDoAuth, toDoRouter); // todo route

app.listen(3000,()=>{
    console.log('app listening on port 3000');
}); 
