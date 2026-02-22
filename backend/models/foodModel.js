import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  mode: { type: String },
  flashSale: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  flashSaleEndsAt: {
    type: Date,
    default: 0
  },
  flashSaleStartsAt: {
    type: Date,
    default: null
  },
  dailySalesCount: {
    type: Number,
    default: 0
  },
  ratings: [
    {
      userId: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  }

})

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema)

export default foodModel;