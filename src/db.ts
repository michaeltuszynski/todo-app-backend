import mongoose, { ConnectOptions } from 'mongoose';

function connectToDatabase(connectionString: any): Promise<typeof mongoose> {
    try {
        const connection = mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions);
        console.log('Connected to MongoDB successfully!');
        return connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export default connectToDatabase;