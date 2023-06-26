const express = require("express");

const { Todomodel } = require("../models/Todo.model");

const todoRouter = express.Router();

todoRouter.get("/", async (req, res) => {
    const query = req.query
    const todos = await Todomodel.find(query)
    res.status(200).send(todos)
})

todoRouter.post("/create", async (req, res) => {
    const { taskname, status, tag } = req.body
    const author_id = req.userID;
    const todo = new Todomodel({
        taskname,
        status,
        tag,
        author_id
    })
    await todo.save();
    res.status(201).send({ "msg": "New Todo Added" })
})

todoRouter.put("/update/:_id", async (req, res) => {
    const { _id } = req.params
    const userID = req.userID
    const todo = await Todomodel.findOne({ _id: _id })
    const author_id = todo.author_id

    if (author_id === userID) {
        const { taskname, status, tag } = req.body;
        try {
            const updatedtodo = await Todomodel.findByIdAndUpdate(_id, {
                taskname,
                status,
                tag
            })

            if (!updatedtodo) {
                res.status(404).send("No match found")
            } else {
                res.status(200).send("Todo Updated")
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        res.send("You are not Authorised")
    }

})

todoRouter.delete("/delete/:_id", async (req, res) => {
    const { _id } = req.params
    const userID = req.userID
    const todo = await Todomodel.findOne({ _id: _id })
    const author_id = todo.author_id

    if (author_id === userID) {
        await Todomodel.findOneAndDelete({ _id: _id })
        res.status(200).send("Deleted Successfully")
    } else {
        res.send("You are not Authorised")
    }

})

module.exports = {todoRouter}