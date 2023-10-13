import {Firestore} from '@google-cloud/firestore';
import config from './config';

const connectToDatabase = (): any => {

    const firestore = new Firestore({
        projectId: config.PROJECT_ID,
        keyFilename: config.SA_KEY_FILE
    });

    return firestore;
}

export default connectToDatabase;