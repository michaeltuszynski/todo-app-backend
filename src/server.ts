// server.ts

import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import connectToDatabase from './db';

const app = express();

// Load environment variables from .env file
const PORT = config.NODEPORT;
const MONGODB_URI = config.MONGODB_URI;

if (process.env.NODE_ENV !== "test") {
    connectToDatabase(MONGODB_URI);
}

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean
    }
});

const Todo = mongoose.model('Todo', todoSchema);


//const allowedOrigins = ['http://localhost:5000','http://localhost:3000'];

app.use(cors<express.Request>());
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

export default app;

// Start the server only if this script is the main module
if (require.main === module) {
    app.listen(PORT!, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}









