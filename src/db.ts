import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import config from './config';
import * as admin from 'firebase-admin';

function getSecretValue() {
    const secretName = process.env.SECRET_NAME!;
    const secretVersion = process.env.SECRET_VERSION!;

    const client = new SecretManagerServiceClient();
    const version:any = client.accessSecretVersion({
      name: `projects/${config.PROJECT_ID}/secrets/${config.SECRET_NAME}/versions/${config.SECRET_VERSION}`,
    });

    const payload = version.payload.data.toString('utf8');
    return payload;
  }


const connectToDatabase = (): any => {
    const serviceAccount = JSON.parse(getSecretValue());
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${config.PROJECT_ID}.firebaseio.com`
    });
    return admin.firestore();
}

export default connectToDatabase;