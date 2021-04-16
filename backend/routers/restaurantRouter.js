import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Restaurant from '../models/restaurantModel.js'

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

export default restaurantRouter;