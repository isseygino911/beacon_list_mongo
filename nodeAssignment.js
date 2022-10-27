const express = require('express')
const app = express() 
const port = 3000;
// const path = require('path')
const fs = require('fs')
const file= './public/todos.json'
const bodyParser = require('body-parser')
const todos = require("./public/todos")
let currentTime = new Date()

// app.use(express.json())
app.use('/public', express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// ======== create new file if now exist ==============

app.post('/todo/:filename', (req,res) => {
    let filename = req.params.filename
    let filepath = __dirname + `/public/${filename}.json`
    let newObj = {
                title: req.body.title ? req.body.title : "",
                description: req.body.description ? req.body.description : "",
                status: req.body.status ? req.body.status: "",
                priority: req.body.priority ? req.body.priority : "",
                timestamp : currentTime
            }
    fs.writeFile(filepath,JSON.stringify(newObj), (err,file)=>{
        if(err) throw err
    } )
    
})

// =========== get all todos ====================
app.get('/todo/todos', (req, res) => {
    fs.readFile(file, (err,data)=>{
        console.log(file)
        if(err) throw err
        res.json(todos)
    })
    }
);

// =========== get todo by id ===================

app.get('/todo/todos/:id',(req, res) => {
    const id = req.params.id
    fs.readFile(file,(err,data)=>{
        let todos = JSON.parse(data)
        let found = todos.find((item) => {
            return parseInt(item.id) == id
        })
        found ? res.json(found) : res.sendStatus(404)
    })
})

// ============= delete todo=======================

app.delete('/todo/todos/:id',(req, res) => {
    const id = req.params.id
    fs.readFile(file,(err,data)=>{
        let todos = JSON.parse(data)
        let found = todos.find((item) => {
            return parseInt(item.id) == id
        })
        let idx = todos.indexOf(found)
        todos.splice(idx,1)
        fs.writeFile(file,JSON.stringify(todos), (err) => {
            if(err) throw err
       })
    })
    res.send('deleted')
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
                title: req.body.title ? req.body.title : found.title,
                description: req.body.description ? req.body.description : found.description,
                status: req.body.status ? req.body.status: found.status,
                priority: req.body.priority ? req.body.priority : found.priority,
                timestamp : currentTime
            }
            let idx = todos.indexOf(found)
            todos.splice(idx,1,newData)
             fs.writeFile(file,JSON.stringify(todos), (err) => {
                 if(err) throw err
            })
            res.send('updated')
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
        console.log(createId)
        let newObj = {
            id: createId,
            title: req.body.title ? req.body.title : "",
            description: req.body.description ? req.body.description : "",
            status: req.body.status ? req.body.status: "",
            priority: req.body.priority ? req.body.priority : "",
            timestamp : currentTime
        }
        todos.push(newObj)
        fs.writeFile(file,JSON.stringify(todos), (err) => {
            if(err) throw err
        })
        res.send('new todo created')
    })
})







app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});