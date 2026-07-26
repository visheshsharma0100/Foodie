import mongoose from "mongoose";
let databaseReady = false;
let connectionPromise = null;

const updateDatabaseState = () => {
    databaseReady = mongoose.connection.readyState === 1;
};

mongoose.connection.on("connected", updateDatabaseState);
mongoose.connection.on("reconnected", updateDatabaseState);
mongoose.connection.on("disconnected", () => { databaseReady = false; });
mongoose.connection.on("error", () => { databaseReady = false; });

export const isDatabaseReady = () => databaseReady || mongoose.connection.readyState === 1;

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        updateDatabaseState();
        return;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured.");

    connectionPromise = mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
        .then(() => {
            updateDatabaseState();
            console.log("Connected to DB");
        })
        .catch((error) => {
            databaseReady = false;
            console.error("Database connection failed:", error.message);
            throw error;
        })
        .finally(() => {
            connectionPromise = null;
        });

    return connectionPromise;
};

export default connectDb;
