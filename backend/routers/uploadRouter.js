import express from 'express';
import { isAuth } from '../utilities.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();
const uploadRouter = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

uploadRouter.post('/', isAuth, async (req, res) => {
    const fileStr = req.body.data;
    const response = await cloudinary.v2.uploader.upload(fileStr, { upload_preset: process.env.UPLOAD_PRESET });

    if (response) {
        res.send(response.public_id);
    }
    else {
        res.status(500).send({ message: 'Image not saved' });
    }
});

export default uploadRouter;