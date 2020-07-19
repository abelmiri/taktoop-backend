import mongoose from "mongoose"

const schema = mongoose.Schema

const postDescriptionModel = new schema({
    post_id: {
        type: schema.Types.ObjectId,
        index: true,
        required: "Enter post_id!",
    },
    type: {
        type: String,
        enum: ["description", "bold", "picture", "thumbnail", "video"],
        default: "description",
        required: "Enter type!",
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
    order: Number,
    creator_id: {
        type: schema.Types.ObjectId,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default postDescriptionModel