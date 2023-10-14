import express from 'express';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { initializeApp, credential, firestore } from 'firebase-admin';
import bodyParser from 'body-parser';
import config from './config';

const app = express();
app.use(bodyParser.json());
const port = config.NODEPORT || 5000;

const getFirebaseCredentialsFromSecretManager = async () => {
  const client = new SecretManagerServiceClient();
  const secretName = `projects/${config.PROJECT_ID}/secrets/${config.SECRET_NAME}/versions/latest`;
  const [version] = await client.accessSecretVersion({name: secretName});
  const payload = version.payload?.data?.toString() || '';
  return JSON.parse(payload);
};

app.get('/health', async (req, res) => {
    try {
      const firebaseCredentials = await getFirebaseCredentialsFromSecretManager();
      initializeApp({
        credential: credential.cert(firebaseCredentials),
      });

      res.status(200).send('API is working');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  const collectionName = 'myData'; // Specify your collection name

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
