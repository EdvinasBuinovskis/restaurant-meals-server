import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Meal from '../models/mealModel.js'
import { isAuth } from '../utilities.js';

const mealRouter = express.Router();

mealRouter.get('/',
    expressAsyncHandler(async (req, res) => {
        const meals = await Meal.find({});
        res.send(meals);
    })
);

mealRouter.get('/:id',
    expressAsyncHandler(async (req, res) => {
        const meal = await Meal.findById(req.params.id);
        if (meal) {
            res.send(meal);
        }
        else {
            res.status(404).send({ message: 'Meal Not Found' });
        }
    })
);

mealRouter.post('/', isAuth,
    expressAsyncHandler(async (req, res) => {
        const meal = new Meal({
            name: req.body.name,
            restaurant_id: req.body.restaurant_id,
            kcal: req.body.kcal,
            protein: req.body.protein,
            fat: req.body.fat,
            carbohydrates: req.body.carbohydrates,
            serving_weight: req.body.serving_weight,
            createdBy: req.body.createdBy
        });
        const createdMeal = await meal.save();
        if (createdMeal) {
            res.status(201).send({ message: 'New Meal Added', meal: createdMeal });
        } else {
            res.status(500).send({ message: 'Error in Adding Meal.' });
        }
    })
);

export default mealRouter;