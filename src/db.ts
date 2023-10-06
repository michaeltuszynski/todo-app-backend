import mongoose, { ConnectOptions, Connection } from 'mongoose';

const connectToDatabase = (connectionString: string): Connection => {

    //const pathToCertificate = './global-bundle.pem';

    const options: ConnectOptions = {
        tlsAllowInvalidCertificates: false,
        //tlsCAFile: pathToCertificate
    }

    let dbConnection: Connection;
    try {
        dbConnection = mongoose.createConnection(connectionString, options);
        dbConnection.on('error', console.error.bind(console, 'Connection error:'));
        dbConnection.once('open', () => {
            console.log('Successfully connected to the database');
        });
        return dbConnection;
    } catch (error) {
        console.error('Error while connecting to the database:', error);
        process.exit(1);
    }
}

export default connectToDatabase;