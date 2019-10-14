import express from "express"
import { Todo } from "./public/models/todo.js"

const app = express()
const port = 5000

let todos = [
    new Todo(0, "Préparer le cours sur AJAX", new Date("2019-11-14")),
    new Todo(1, "Trouver un sujet de cours pour la semaine pro", new Date("2019-11-21"))
]

app.use(express.static("public"))
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/todo", function (req, res) {
    res.send(todos)
})

app.post("/todo", function (req, res) {
    const usedIds = todos.map(function (todo) {
        return todo.id
    })

    const deadline = new Date(req.body.deadline)
    if (typeof req.body.id === "number" && !usedIds.includes(req.body.id) &&
        typeof req.body.title === "string" && req.body.title.length > 0 &&
        !isNaN(deadline.valueOf())) {

        const id = req.body.id
        const title = req.body.title
        todos.push(new Todo(id, title, deadline))
        res.status(200).json({ msg: `todo ${id} has been correctly created` })
    } else {
        console.log("Error POST - ", req.body)
        let errorMsg = "Unknown error case"
        if (typeof req.body.id !== "number") {
            errorMsg = "The provided id must be an number"
        } else if (usedIds.includes(req.body.id)) {
            errorMsg = "The provided id must NOT belong to an already existing todo"
        } else if (req.body.title === "string") {
            errorMsg = "The provided title must be a string"
        } else if (req.body.title.length === 0) {
            errorMsg = "The provided title must NOT be the empty string"
        } else if (isNaN(deadline.valueOf())) {
            errorMsg = "The provided deadline must be a valid date"
        }
        res.status(400).json({ errorMsg })
    }
})

app.delete("/todo/:id", function (req, res) {
    const usedIds = todos.map(function (todo) {
        return todo.id
    })

    const id = Number.parseInt(req.params.id)
    if (Number.isInteger(id) && usedIds.includes(id)) {

        todos = todos.filter(function (todo) {
          return todo.id !== id
        })
        res.status(200).json({ msg: `todo ${id} has been correctly deleted` })
    } else {
        console.log("Error DELETE - ", req.params)
        let errorMsg = "Unknown error case"
        if (typeof req.params.id !== "number") {
            errorMsg = "The provided id must be an number"
        } else if (!usedIds.includes(req.params.id)) {
            errorMsg = "The provided id must belong to an existing todo"
        }
        res.status(400).json({ errorMsg })
    }
})

app.get("/", function (req, res) {
    res.sendFile("./index.html", { root: "." })
})

app.use((function (req, res) {
    res.sendStatus(404)
}))

app.listen(port, function () {
    console.log(`Server up and running at localhost:${port}`)
})
