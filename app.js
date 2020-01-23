import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import authRouter from "./routes/authRouter";

const app = express();
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500, // Reconnect every 500ms
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Erro de conexão."))
db.once('open', function() {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function() {
    console.log('MongoDB reconnected!');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.use('/login', authRouter);

export default app;
