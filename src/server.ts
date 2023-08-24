// server.ts

import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser';
import { Todo } from './models/Todo';
import config from './config';

const app = express();

// Load environment variables from .env file

const uri = config.MONGODB_URI;
const PORT = config.NODEPORT;

// Connect to MongoDB
mongoose.connect(uri!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions);

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    detail: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        required: true
    }
});

const Todo = mongoose.model('Todo', todoSchema);

app.use(bodyParser.json());

//List all todos
app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

//List a single todo
app.get('/todos/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
});

//Create One Todo
app.post('/todos', async (req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
});

// Update a todo
app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
});

app.listen(PORT!, () => {
    console.log(`Server is running on port ${PORT}`);
});











