import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Meal from '../models/mealModel.js'
import { isAdmin, isAuth } from '../utilities.js';

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
            servingWeight: req.body.servingWeight,
            createdBy: req.body.createdBy,
            image: req.body.image
        });
        const createdMeal = await meal.save();
        if (createdMeal) {
            res.status(201).send({ message: 'New Meal Added', meal: createdMeal });
        } else {
            res.status(500).send({ message: 'Error in Adding Meal.' });
        }
    })
);

mealRouter.put('/:id', isAuth,
    expressAsyncHandler(async (req, res) => {
        const meal = await Meal.findById(req.params.id);
        if (meal && meal.createdBy === req.user._id) {
            meal.name = req.body.name || meal.name;
            meal.restaurant_id = req.body.restaurant_id || meal.restaurant_id;
            meal.kcal = req.body.kcal || meal.kcal;
            meal.protein = req.body.protein || meal.protein;
            meal.fat = req.body.fat || meal.fat;
            meal.carbohydrates = req.body.carbohydrates || meal.carbohydrates;
            meal.servingWeight = req.body.servingWeight || meal.servingWeight;
            meal.createdBy;
            meal.image = req.body.image || meal.image;
            const updatedMeal = await meal.save();
            res.send({ message: 'Meal Updated', meal: updatedMeal });
        } else {
            res.status(404).send({ message: 'Meal Not Found' });
        }
    })
);

mealRouter.delete('/:id', isAuth,
    expressAsyncHandler(async (req, res) => {
        const meal = await Meal.findById(req.params.id);
        if (meal && meal.createdBy === req.user._id) {
            const deleteMeal = await meal.remove();
            res.send({ message: 'Meal Deleted', meal: deleteMeal });
        }
        else {
            res.status(404).send({ message: 'Meal Not Found' });
        }
    })
);

mealRouter.put('/:id/changeApprove', isAuth, isAdmin,
    expressAsyncHandler(async (req, res) => {
        const meal = await Meal.findById(req.params.id);
        if (meal) {
            meal.approved = !meal.approved;
            const updatedMeal = await meal.save();
            res.send({ message: 'Meal Approve Changed', meal: updatedMeal });
        } else {
            res.status(404).send({ message: 'Meal Not Found' });
        }
    })
);

export default mealRouter;