const mongoose = require("mongoose")

const ratingAndReviewsSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    rating: {
        type: Number
    },

    review: {
        type: String,
        trim:true,
        required:true
    }
})

module.exports = mongoose.model("RatingAndReviews", ratingAndReviewsSchema)