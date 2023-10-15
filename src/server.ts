import express from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { initializeApp, credential, firestore } from 'firebase-admin';
import * as admin from 'firebase-admin';
import bodyParser from 'body-parser';
import config from './config';

const app = express();
app.use(bodyParser.json());
const port = config.NODEPORT || 5000;

async function initializeFirebase() {
    const projectID = config.PROJECT_ID;
    const secretName = config.SECRET_NAME;
    const secretVersion = config.SECRET_VERSION;

    const name = `projects/${projectID}/secrets/${secretName}/versions/${secretVersion}`;

    const secretClient = new SecretManagerServiceClient();

    try {
        // Access the secret version
        const [version] = await secretClient.accessSecretVersion({ name });

        // Parse secret payload as JSON, assuming the secret is a JSON string
        const serviceAccountKey = JSON.parse(version.payload?.data?.toString() || '');

        // Initialize the Firebase Admin SDK with the obtained service account key
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountKey),
        });

        console.log('Firebase has been initialized');
    } catch (error) {
        console.error('Error initializing Firebase: ', error);
        process.exit(1); // Exit the process with an error code
    }
}

const collectionName = 'myData';

async function initializeDoc() {
    const db = firestore();
    const docRef = db.collection(collectionName).doc('myDoc');
    docRef.set({title: 'Hello World', completed: true});
}

initializeFirebase();

app.get('/', async (req, res) => {
    await initializeDoc();
    res.send('Hello World!');
});

app.post('/todos', async (req, res) => {
    try {
        const { data } = req.body;
        const db = firestore();
        const docRef = await db.collection(collectionName).add(data);
        res.status(201).send({ id: docRef.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/todos', async (req, res) => {
    try {
      const db = firestore();
      const snapshot = await db.collection(collectionName).get();
      const allData: any[] = [];
      snapshot.forEach((doc) => allData.push({ id: doc.id, ...doc.data() }));
      res.status(200).send(allData);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.get('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = firestore();
      const doc = await db.collection(collectionName).doc(id).get();
      if (doc.exists) {
        res.status(200).send({ id: doc.id, ...doc.data() });
      } else {
        res.status(404).send('Not Found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const db = firestore();
      await db.collection(collectionName).doc(id).set(data, { merge: true });
      res.status(200).send('Updated Successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = firestore();
      await db.collection(collectionName).doc(id).delete();
      res.status(200).send('Deleted Successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
