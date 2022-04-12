"use strict";
import express from 'express';
import 'express-async-errors';
import { NotFoundError, errorHandler, currentUser } from '@shahabazkc-ticket-microservice/common';

import mongoose, { ConnectOptions } from 'mongoose';
import cookieSession from 'cookie-session';

import { natsWrapper } from './nats-wrapper';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', true);
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);

app.use(currentUser);

app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);


app.all('*', () => {
    throw new NotFoundError()
});

app.use(errorHandler);

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID must be defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        natsWrapper.client.on('close', () => {
            console.log("NATS connection closed");
            process.exit();
        });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());


        await mongoose.connect(process.env.MONGO_URI!,
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
