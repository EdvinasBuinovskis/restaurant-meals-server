import multer from 'multer';
import express from 'express';
import { isAuth } from '../utilities.js';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${Date.now()}.jpg`);
    },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
    if (req.file.path) {
        res.send(`/${req.file.path}`);
    }
    else {
        res.status(500).send({ message: 'Image not saved' });
    }

});

export default uploadRouter;