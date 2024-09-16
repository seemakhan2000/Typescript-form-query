import mongoose from 'mongoose';

const mongoDB = "mongodb+srv://seema:seema38436065@cluster0.ow7iytj.mongodb.net/ReactProject";

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
