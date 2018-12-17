const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// connect to database..
mongoose.connect(config.get('db'))
.then(()=>{
    console.log(`mongoDB Connected.. `);
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

require('./startup/prod')(app);

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

const PORT = process.env.PORT || 8484;

app.listen(PORT,()=>{
    console.log(`app listening on port ${PORT}`);

}); 
