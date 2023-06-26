const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
    taskname : String,
    status : String,
    tag : String,
    author_id : String
})

const Todomodel = mongoose.model("todo", todoSchema)

module.exports = {Todomodel}