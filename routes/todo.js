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
})

module.exports = router;