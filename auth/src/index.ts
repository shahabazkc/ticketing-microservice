"use strict";
import express from 'express';
import 'express-async-errors';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import mongoose, { ConnectOptions } from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', true);
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
)


app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
    throw new NotFoundError()
});

app.use(errorHandler);

const start = async () => {
    if(!process.env.JWT_KEY){
       throw new Error('JWT_KEY must be defined');
    }
    
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions
        );
        console.log("Connected to MongoDb");

    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log("Listening on port 3000!!!!");
    });

}

start();
