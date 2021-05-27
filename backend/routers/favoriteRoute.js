import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js'
import { isAuth } from '../utilities.js';

const favoriteRouter = express.Router();

favoriteRouter.get('/', isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user.favorites) {
            res.send(
                user.favorites
            );
        } else {
            res.status(404).send({ message: 'Favorites Not Found' });
        }
    })
);

favoriteRouter.post('/', isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user && !user.favorites.includes(req.body.favorite)) {
            user.favorites.push(req.body.favorite);
            const updatedFavorites = await user.save();
            res.send({
                favorites: updatedFavorites.favorites
            });
        } else if (user.favorites.includes(req.body.favorite)) {
            res.status(400).send({ message: 'Favorite Already Added' });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

favoriteRouter.delete('/', isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.user._id);
        if (user && user.favorites.includes(req.body.favorite)) {
            user.favorites.pull(req.body.favorite);
            const updatedFavorites = await user.save();
            res.send({
                favorites: updatedFavorites.favorites
            });
        } else if (!user.favorites.includes(req.body.favorite)) {
            res.status(400).send({ message: 'Favorite Already Removed' });
        } else {
            res.status(404).send({ message: 'User Not Found' });
        }
    })
);

export default favoriteRouter;