import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Firestore } from '@google-cloud/firestore';
import config from './config';
import cors from 'cors';


const app = express();

const projectId = config.PROJECT_ID;
const port = config.NODEPORT;
const secretName = config.SECRET_NAME;
const secretVersion = config.SECRET_VERSION;
const collectionName = config.COLLECTION_NAME;

app.use(bodyParser.json());
app.use(cors());

let firestore: Firestore;

async function initFirebase(): Promise<void> {
  const client = new SecretManagerServiceClient();
  const mySecretName = `projects/${projectId}/secrets/${secretName}/versions/${secretVersion}`;
  const [version] = await client.accessSecretVersion({ name: mySecretName });
  const credentials = JSON.parse(version?.payload?.data?.toString() ?? '');

  firestore = new Firestore({ credentials });
}

app.get('/todos', async (req: Request, res: Response) => {
  try {
    const snapshot = await firestore.collection(collectionName).get();
    const todos: any[] = [];
    snapshot.forEach(doc => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(todos);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const docRef = await firestore.collection(collectionName).add({ title, completed: false });
    res.status(201).json({ id: docRef.id });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const doc = await firestore.collection(collectionName).doc(id).get();
    if (doc.exists) {
      res.status(200).json({ id: doc.id, ...doc.data() });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  try {
    const todo = await firestore.collection(collectionName).doc(id).set({ title, completed }, { merge: true });
    res.json(todo);
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await firestore.collection(collectionName).doc(id).delete();
    res.json({ message: 'Todo deleted' });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, async () => {
  await initFirebase();
  console.log(`App listening at http://localhost:${port}`);
});
