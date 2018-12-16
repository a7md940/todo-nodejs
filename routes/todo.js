const router = require('express').Router();
const {Todo, validateTodo} = require('../models/todo');
const _ = require('lodash');


router.post('/', async (req,res)=>{
    // set body.userId as the userId that come from JWt..
    const payload = req.header('payload');
    req.body.userId = payload.id;

    const body = _.pick(req.body, ['title', 'desc', 'checked', 'userId']);

    // Joi Validation..
    const toDoError = validateTodo(body).error;
    if(toDoError) return res.status(400).send(toDoError.details[0].message);

    // make toDo and save it..
    let toDo = await new Todo(body);
    await toDo.save();

    // send response..
    return res.status(200).send({
        success: true, 
        data: {
            userId: toDo.userId,
            id: toDo._id,
            title: toDo.title,
            desc: toDo.desc || null,
            checked: toDo.checked
        }
    });
});

router.get('/', async (req, res)=>{
try{
    const toDoId = req.query.toDoId;
    if(!toDoId){
        const userId = req.header('payload').id;
        const toDosByUserId = await Todo
        .find({userId: userId})
        .select(['title','description','_id','userId','checked']);

        if(!toDosByUserId)
            return res.status('400').send({success: false, msg: `Sorry there's no todo for you till now.`});
        
        return res.status(200).send({success: true,data: [...toDosByUserId]});
    }else {
        Todo.findById(toDoId)
        .then(data=>{
            return res.status(200).send({success: true, data: data});
        })
        .catch(err =>{
            return res.status(400).send({success: false, msg:'this toDo is not found.'});
        });
        
    }
}catch(ex){
    console.err(ex);
}
});

router.delete('/:id', async (req, res)=>{
    let toDoId = req.params.id;
    if(!toDoId) return res.status(400).send({success: false, msg: 'you have insert todo Id to delete.'});

    let todoDeleted = await Todo.findByIdAndRemove(toDoId);
    return res.status(200).send({success: true, data: todoDeleted});
});

router.put('/', async (req, res)=>{
    const toDoId = req.body.toDoId;
    const newToDo = req.body.newToDo;

    if(!toDoId) return res.status(400).send({success: false, msg: 'invalid toDo id.'});
    if(!newToDo) return res.status(40).send({success: false, msg: 'Sorry, you have to insert toDo data.'});

    Todo.findById(toDoId)
    .then((data)=>{
        if(data.title == newToDo.title) return res.status(400).send({success: false, msg: 'Sorry, you have insert new toDo data to update.'});
        
    })
    .catch((err)=> res.status(400).send({success: false, msg: err}));

    let updatedToDo = await Todo.findByIdAndUpdate(toDoId, newToDo,{new: true});
    return res.status(200).send({success: true, data: updatedToDo, msg: 'todo successfully updated.'});
});

module.exports = router;