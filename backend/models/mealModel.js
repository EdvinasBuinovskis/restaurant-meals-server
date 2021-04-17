import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    restaurant_id: { type: String, required: true },
    kcal: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    servingWeight: { type: Number },
    approved: { type: Boolean, default: false },
    createdBy: { type: String }
}, {
    timestamps: true
});

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;