/* eslint-disable no-unused-vars */
import express from 'express';
import mongoose from 'mongoose';
import mealRouter from './routers/mealRouter.js';
import restaurantRouter from './routers/restaurantRouter.js';
import userRouter from './routers/userRouter.js'
import favoriteRouter from './routers/favoriteRoute.js';
import dotenv from 'dotenv';
import path from 'path';
import uploadRouter from './routers/uploadRouter.js';
import cors from 'cors';

dotenv.config();

const app = express();

var corsOptions = {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/restaurant-meals-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

app.use('/api/meals', mealRouter);
app.use('/api/restaurants', restaurantRouter);
app.use('/api/users', userRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/uploads', uploadRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});