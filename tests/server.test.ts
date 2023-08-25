import request from 'supertest';
import app from '../src/server';
import connectToDatabase from '../src/db';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
let createdTodoId: any;


beforeAll(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await connectToDatabase(mongoUri);
});

afterAll(async () => {
  jest.setTimeout(20000)
  await mongo.stop();
  await mongoose.connection.close();
});

describe('Todo API', () => {
    it('should list all todos', async () => {
        const res = await request(app).get('/todos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should create a new todo', async () => {
        const res = await request(app).post('/todos').send({
            title: 'Test Todo',
            completed: false
        });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Test Todo');
        createdTodoId = res.body._id;  // Store the created todo's ID for further tests
    });

    it('should fetch a single todo', async () => {
        const res = await request(app).get(`/todos/${createdTodoId}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Test Todo');
    });

    it('should update a todo', async () => {
        const updatedTitle = 'Updated Test Todo';
        const res = await request(app).put(`/todos/${createdTodoId}`).send({
            title: updatedTitle
        });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe(updatedTitle);
    });

    it('should delete a todo', async () => {
        const res = await request(app).delete(`/todos/${createdTodoId}`);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Todo deleted');

        // Verify that the todo was indeed deleted
        // const verifyRes = await request(app).get(`/todos/${createdTodoId}`);
        // expect(verifyRes.status).toBe(404);  // Not found
    });

});
