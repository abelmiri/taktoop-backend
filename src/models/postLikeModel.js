import mongoose from "mongoose"

const schema = mongoose.Schema

const postLikeModel = new schema({
    user_id: {
        type: schema.Types.ObjectId,
        required: "Enter user_id!",
    },
    post_id: {
        type: schema.Types.ObjectId,
        required: "Enter post_id!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

postLikeModel.index({user_id: 1, post_id: 1}, {unique: true})

export default postLikeModel