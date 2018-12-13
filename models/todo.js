const mongoose = require('mongoose');
const joi = require('joi');


const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minLength: 3,
    },
    description: {
        type: String,
        required: false,
    },
    checked: {
        type: Boolean,
        required: false,
        default: false,
    }
});


const Todo = mongoose.model('Todo', todoSchema);


function validateTodo(toDo){
    const joiSchema = {
        userId: joi.string().required(),
        title: joi.string().required().min(3).max(50),
        desc: joi.string().min(5),
        checked: joi.boolean()
    }
    return joi.validate(toDo, joiSchema);
}

exports.Todo = Todo;
exports.validateTodo = validateTodo;
