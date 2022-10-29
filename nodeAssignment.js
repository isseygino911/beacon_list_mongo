const express = require('express')
const app = express() 
const mongoose = require('mongoose')
const TodoModel = require('./models/TodoModel')
const port = 3000;
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
require('dotenv').config()

app.set("view engine", "ejs");
app.use(express.json())
app.use('/public', express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
mongoose.connect(process.env.BEACON_TODO_DB)
const content = {title: "Todo App"}

// =========== get all todos ====================
app.get('/', (req, res) => {
    TodoModel.find({}).then((todos)=>{
        console.log('Loding Successed')
        res.render("index",{todos, content})
    }).catch((err) => {
        console.log('Failed to load todos!', err)
    })
});

// ============= delete todo=======================

app.delete('/todo/todos/:id', async (req, res) => {
    const postId = req.params.id
    await TodoModel.deleteOne({id: postId}).then(() => {
        console.log(`post ${postId} has been deleted!`)
    }).catch((err)=>{
        console.log('err')
    })
    res.redirect('/')   
})

// ======= update todo==============================

app.put('/todo/todos/:id', async (req, res) => {
    const postId = req.params.id
    const todo = {
        title: req.body.title,
        status: "Completed"
    }
    await TodoModel.updateOne({_id: postId},todo).then(() => {
        console.log('Todo updated!')
    }).catch((err) => {
        console.log(err)
    })
    res.redirect('/')
})

// =========== post new todo ======================

app.post('/todo/todos', async (req, res) => {
    const todos = await TodoModel.find({})
    const itemNumber = todos.length > 0 ? todos[todos.length - 1].itemNumber + 1 : 1
    const title = req.body.title
    const newTodo = new TodoModel({itemNumber: itemNumber, title: title})
    await newTodo.save().then(() => {
        console.log('New post created')
    }).catch((err) =>{
        console.log(err)
    })
    res.redirect('/')

})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
