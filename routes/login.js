const router = require('express').Router();
const { User } = require('../models/user');
const _ = require('lodash');
const joi = require('joi');
const bcrypt = require('bcrypt');


router.post('/', async (req, res)=>{
try{
    const body = _.pick(req.body, ['username', 'password']);

    // Joi Validation..
    const usernameError = validate(body).error;
    if(usernameError) return res.status(400).send(usernameError.details[0].message);
    
    // check if user exist or not
    let user = await User.findOne({username: body.username});
    if(!user) return res.status(400).send({success: false, msg: `username or password is invalid.`});

    // check if password is valid.
    let password = await bcrypt.compare(body.password, user.password);
    if(!password) return res.status(400).send({
        success: false,
        msg: `username or password is invalid.`
    });

    // response
    res.status(200).send({success: true, token: user.makeJWT(), data: {username: user.username, id: user._id}});
}catch(ex){
    console.error(ex);
}
});

function validate(reqBody){
    const joiSchema = {
        username: joi.string().required().min(3),
        password: joi.string().required()
    }
    return joi.validate(reqBody, joiSchema);
}


module.exports = router;