const express = require('express')
const app = express() 
const port = 3000;
const fs = require('fs')
const file= './public/todos.json'
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')

let currentTime = new Date()
let content = {title: "Todo App"}

app.set("view engine", "ejs");

app.use(express.json())
app.use('/public', express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

// =========== get all todos ====================
app.get('/', (req, res) => {
    fs.readFile(file, (err,data)=>{
        let todos = JSON.parse(data)
        if(err) throw err
        res.render("getAllTodos",{todos, content})
    })
});

// ============= delete todo=======================

app.delete('/todo/todos/:id',(req, res) => {
    const id = req.params.id
    fs.readFile(file,(err,data)=>{
        let todos = JSON.parse(data)
        let found = todos.find((item) => {
            return parseInt(item.id) == id
        })
        console.log(found)
        let idx = todos.indexOf(found)
        todos.splice(idx,1)
        fs.writeFile(file,JSON.stringify(todos), (err) => {
            if(err) throw err
        })
    })
    res.redirect('/')
   
})

// ======= update todo==============================

app.put('/todo/todos/:id', (req, res) => {
    const id = req.params.id
    fs.readFile(file, (err,data) => {
        let todos = JSON.parse(data)
        let found = todos.find((item) => {
            return parseInt(item.id) == id
        })
        if(found){
            let newData = {
                id: found.id,
                title: found.title,
                status: "Completed",
                timestamp : currentTime
            }
            let idx = todos.indexOf(found)
            todos.splice(idx,1,newData)
            console.log(todos)
             fs.writeFile(file,JSON.stringify(todos), (err) => {
                 if(err) throw err
            })
            res.redirect("/")
        }else{
            res.send('no such todo')
        }
    })
})

// =========== post new todo ======================

app.post('/todo/todos', (req, res) => {
    fs.readFile(file, (err,data) => {
        let todos = JSON.parse(data)
        let createId = todos.length + 1
        let newObj = {
            id: createId,
            title: req.body.title ? req.body.title : "",
            status: "In progress",
            timestamp : currentTime
        }
        todos.push(newObj)
        fs.writeFile(file,JSON.stringify(todos), (err) => {
            if(err) throw err
        })     
        res.redirect("/")
    })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
