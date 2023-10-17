import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Firestore } from '@google-cloud/firestore';
import config from './config';

const app = express();

const projectId = config.PROJECT_ID;
const port = config.NODEPORT;
const secretName = config.SECRET_NAME;
const secretVersion = config.SECRET_VERSION;
const databaseName = config.DATABASE_NAME;


app.use(bodyParser.json());

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
    const snapshot = await firestore.collection('todos').get();
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
    const docRef = await firestore.collection('todos').add({ title, completed: false });
    res.status(201).json({ id: docRef.id });
  } catch (err:any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, async () => {
  await initFirebase();
  console.log(`App listening at http://localhost:${port}`);
});
