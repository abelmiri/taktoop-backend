import mongoose from "mongoose"

const schema = mongoose.Schema

const linksModel = new schema({
    link: {
        type: String,
        required: "Enter Link!",
    },
    text: {
        type: String,
        trim: true,
        required: "Enter Text!",
    },
    creator_id: {
        type: schema.Types.ObjectId,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default linksModel