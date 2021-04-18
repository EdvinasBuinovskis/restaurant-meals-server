import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js'
import { isAdmin, isAuth } from '../utilities.js';

const restaurantRouter = express.Router();

restaurantRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const restaurants = await Restaurant.find({});
        res.send(restaurants);
    })
);

restaurantRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            res.send(restaurant);
        }
        else {
            res.status(404).send({ message: 'Restaurant Not Found' });
        }
    })
);

restaurantRouter.post('/', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) => {
        const restaurant = new Restaurant({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description
        });
        const createdRestaurant = await restaurant.save();
        if (createdRestaurant) {
            res.status(201).send({ message: 'New Restaurant Added', restaurant: createdRestaurant });
        } else {
            res.status(500).send({ message: 'Error in Adding Restaurant.' });
        }
    })
);

restaurantRouter.put('/:id', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) => {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            restaurant.name = req.body.name || restaurant.name;
            restaurant.image = req.body.image || restaurant.image;
            restaurant.description = req.body.description || restaurant.description;
            const updatedRestaurant = await restaurant.save();
            res.send({ message: 'Restaurant Updated', restaurant: updatedRestaurant });
        } else {
            res.status(404).send({ message: 'Restaurant Not Found / Unauthorized' });
        }
    })
);

restaurantRouter.delete('/:id', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) => {
        const restaurant = await Restaurant.findById(req.params.id);
        if (restaurant) {
            const deleteRestaurant = await restaurant.remove();
            res.send({ message: 'Restaurant Deleted', restaurant: deleteRestaurant });
        }
        else {
            res.status(404).send({ message: 'Restaurant Not Found / Unauthorized' });
        }
    })
);

export default restaurantRouter;