import {Firestore} from '@google-cloud/firestore';
import config from './config';

const email = config.GOOGLE_SERVICE_ACCOUNT_EMAIL;
//const key = config.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
const key = config.GOOGLE_PRIVATE_KEY

const connectToDatabase = (): any => {

    const firestore = new Firestore({
        projectId: config.PROJECT_ID,
        credentials: {
            client_email: email,
            private_key: key,
        },
    });

    return firestore;
}

export default connectToDatabase;