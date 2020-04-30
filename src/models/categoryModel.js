import mongoose from "mongoose"

const schema = mongoose.Schema

const categoryModel = new schema({
    title: {
        type: String,
        required: "Enter title!",
    },
    description: {
        type: String,
    },
    address: {
        type: String,
    },
    parent_id: {
        type: schema.Types.ObjectId,
        default: null,
    },
    slider_picture: {
        type: String,
    },
    menu_picture: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default categoryModel