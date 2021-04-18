import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
}, {
    timestamps: true
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;



