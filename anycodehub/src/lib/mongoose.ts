'use server';

import moongose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    try {
        validConnect();
        if (isConnected) return;

        await moongose.connect(process.env.MONGDB_CONNECTIONSTRING || '', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
            dbName: 'anycodehub'
        });

        isConnected = moongose.connection.readyState == 1 || moongose.connection.readyState == 2;
        console.log(`Connected successfully to database`);
    }
    catch (err) {
        console.error(`Error while connecting to database`, err);
        if (moongose.connection.readyState == 1 || moongose.connection.readyState == 2) moongose.connection.close();
    }
}


const validConnect = () => {
    if (!process.env.MONGDB_CONNECTIONSTRING) throw new Error(`MongoDB connection string is not defined`);
}