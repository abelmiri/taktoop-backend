import mongoose from "mongoose"

const schema = mongoose.Schema

const postModel = new schema({
    category_id: {
        type: schema.Types.ObjectId,
        index: true,
        required: "Enter category_id!",
    },
    title: {
        type: String,
        required: "Enter name!",
        unique: true,
        minLength: 5,
        maxLength: 80,
    },
    short_description: {
        type: String,
        trim: true,
        required: "Enter short_description!",
        minLength: 10,
        maxLength: 250,
    },
    picture: {
        type: String,
        required: "Enter picture!",
    },
    creator_id: {
        type: schema.Types.ObjectId,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default postModel