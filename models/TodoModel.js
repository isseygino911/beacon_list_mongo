const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    itemNumber: {
        type: Number,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default: "In Prograss"
    },
})

const TodoModel = mongoose.model("todo", TodoSchema)
module.exports = TodoModel