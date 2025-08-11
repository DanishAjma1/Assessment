import dotenv from "dotenv";
dotenv.config();

import MongoStore from "connect-mongo";

const sessionStore = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    collectionName: 'sessions'
});
export default sessionStore;