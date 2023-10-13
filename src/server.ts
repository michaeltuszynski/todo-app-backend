// server.ts

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectToDatabase from './db';
import config from './config';

const app = express();
app.use(bodyParser.json());
let Todo = connectToDatabase();
const PORT = config.NODEPORT;

// if (process.env.NODE_ENV !== "test") {
//     Todo = connectToDatabase();
// }

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
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  }));

app.use('/todos', cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
  }));

//List all todos

// Get All ToDos
app.get('/todos', cors(), async (_req, res) => {
    try {
        const todosRef = Todo.collection('todos');
        const snapshot = await todosRef.get();
        const todos = snapshot.docs.map((doc:any) => ({id: doc.id, ...doc.data()}));

        res.json(todos);
    } catch (error:any) {
        res.status(500).send(error.toString());
    }
});


//List a single todo
app.get('/todos/:id', cors(), async (req, res) => {
    try {
        const {id} = req.params;
        const todoRef = Todo.collection('todos').doc(id);
        const doc = await todoRef.get();

        if (!doc.exists) {
          res.json('ToDo not found');
        } else {
          res.json({id: doc.id, ...doc.data()});
        }
      } catch (error:any) {
        res.status(500).send(error.toString());
      }
});

//Create One Todo
app.post('/todos', cors(), async (req, res) => {
    try {
        const {title} = req.body;
        const todosRef = Todo.collection('todos');
        const docRef = await todosRef.add({title, completed: false});
        res.json({id: docRef.id});
      } catch (error:any) {
        res.json(error.toString());
      }
});

// Update a todo
app.put('/todos/:id', cors(), async (req, res) => {
    try {
        const {id} = req.params;
        const {title, completed} = req.body;
        const todoRef = Todo.collection('todos').doc(id);

        await todoRef.update({title, completed});

        res.json({id, title, completed});
      } catch (error:any) {
        res.status(500).send(error.toString());
      }
});

// Delete a todo
app.delete('/todos/:id', cors(), async (req, res) => {
    try {
        const {id} = req.params;
        const todoRef = Todo.collection('todos').doc(id);

        await todoRef.delete();

        res.json();
      } catch (error:any) {
        res.json(error.toString());
      }
});

export default app;

// Start the server only if this script is the main module
if (require.main === module) {
    app.listen(PORT!, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}









