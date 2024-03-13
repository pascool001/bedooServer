const HyperExpress = require('hyper-express');
const todo_api_router = new HyperExpress.Router()

const repository = require("../database/mongodb/repository");
const Todo = repository("Todo")

todo_api_router.route('/todos').post(async (request, response) => {
    const {title } = await request.json();
    let todo = await Todo.Create({title})
    response.sendSSE(todo, 'add-todo')
    response.send(JSON.stringify(todo));

}).get(async (request, response) => {
    const todoList = await Todo.getAll()
    return response.json(todoList)
})

todo_api_router.route('/todo/:id').get(async (request, response) => {
    let id = request.path_parameters.id;
    const todo = await Todo.GetById(id)
    return response.json({...todo})
}).put(async (request, response) => {
    let id = request.path_parameters.id;
    let body = await request.json();
    console.log(id, body)
    const UpdatedData = await Todo.Update(body, id)
    return response.json(UpdatedData)
}).delete( async (request, response) => {
    let id = request.path_parameters.id;
    const result = await Todo.remove(id)
    return response.json({...result.toJSON()})
})

module.exports = todo_api_router