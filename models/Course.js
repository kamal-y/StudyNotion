const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({

    courseName: {
        type: String,
        required: true
    },

    courseDescription: {
        type: String,
        required: true
    },

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    whatWillYouLearn: {
        type: String
    },

    courseContent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section"
        }
    ],

    ratingAndReviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReviews"
        }
    ],

    price: {
        type: Number
    },

    thumbnail: {
        type: String
    },

    tag: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tags"
        }
    ],

    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]

})

module.exports = mongoose.model("Course", courseSchema)