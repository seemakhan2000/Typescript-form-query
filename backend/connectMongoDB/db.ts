import mongoose from 'mongoose';

const mongoDB: string = process.env.MONGODB_URL as string;

async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(mongoDB);

        console.log('MongoDB is connected');
    } catch (error) {
        console.error(`Unable to connect to the server: ${error}`);
        throw new Error(`Unable to connect to the server: ${error}`);
    }
}

export default connectDB;


