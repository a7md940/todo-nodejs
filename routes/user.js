const router = require('express').Router();
const { User } = require('../models/user');

router.get('/', (req, res)=>{
    if(! (req.query.username || req.query.email)) return res.status(400).send({msg: 'invalid username or email.'};)

    if(req.query.username){
        User.find({username: req.query.username})
        .then(result =>{
            if(result.length > 0)
            return res.send({success: false, msg: 'username is not available.'});
            
            return res.send({success:true, msg: 'username is available.'})
        })
        .catch(err => res.send({err: err}));
    }

    if(req.query.email){
        User.find({email: req.query.email})
        .then(result =>{
            if(result.length > 0)
            return res.send({success: false, msg: 'email is already exist.'});
            
            return res.send({success:true, msg: 'email is available.'})
        })
        .catch(err => res.send({err: err}));
    }
});

module.exports = router;