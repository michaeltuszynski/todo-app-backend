// server.ts

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import connectToDatabase from './db';

const app = express();

// Load environment variables from environment
const PORT = config.NODEPORT;
const DOMAIN = config.DOMAIN;
console.log(`DOMAIN: ${DOMAIN}`);
// const DB_ENDPOINT= config.DB_ENDPOINT;
// const DB_USER = config.DB_USER;
// const DB_PASSWORD = config.DB_PASSWORD;
// const DB_PORT = config.DB_PORT;


//const DB_CONNECTSTRING = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/?tls=true&tlsCAFile=global-bundle.pem&retryWrites=false`;
const DB_CONNECTSTRING = `${config.COSMOSDB_CONNECTION_STRING}`
let dbConnection:any;

if (process.env.NODE_ENV !== "test") {
    dbConnection = connectToDatabase(DB_CONNECTSTRING);
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

const Todo = dbConnection.model('Todo', todoSchema);

app.get('/health', async (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error:any) {
        healthcheck.message = error;
        res.status(503).send();
    }
});

app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      console.log(origin);
      // Check if the origin contains domain
      if (origin.indexOf(`.${DOMAIN}`) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  },
  ));

app.use(bodyParser.json());

app.options('*', cors());

//List all todos
app.get('/todos', cors(), async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

//List a single todo
app.get('/todos/:id', cors(), async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    res.json(todo);
});

//Create One Todo
app.post('/todos', cors(), async (req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.json(todo);
});

// Update a todo
app.put('/todos/:id', cors(), async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
});

// Delete a todo
app.delete('/todos/:id', cors(), async (req, res) => {
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









