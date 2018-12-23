const router = require('express').Router();
const { User } = require('../models/user');
const { Todo } = require('../models/todo');

router.get('/', async (req, res)=>{
    if(! (req.query.username || req.query.email || req.query.userId)) 
        return res.status(400).send({msg: 'invalid query parameter.'});

    if(req.query.userId){
       let allTodos = await Todo.find({userId: req.query.userId})
       .select({title: 1, _id: 0, checked: 1})
       .catch(err=>  res.send({success: false, msg:'there is no todos for this user'}));

       let completedTodo = await Todo.find({userId: req.query.userId, checked: true})
       .select({title: 1, _id: 0, checked: 1})
       .catch(err => res.send({success: false, msg:'there is no todos for this user'}));

        return res.send({success: true, allTodos, completedTodo});
    }

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