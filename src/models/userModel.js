import mongoose from "mongoose"

const schema = mongoose.Schema

const userModel = new schema({
    phone: {
        type: String,
        trim: true,
        unique: true,
        minlength: 11,
        maxlength: 11,
        index: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        index: true,
        required: "Enter email!",
    },
    password: {
        type: String,
        minlength: 8,
        maxlength: 128,
        required: "Enter password!",
    },
    picture: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: "Enter role!",
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 32,
        required: "Enter name!",
    },
    created_date: {
        type: Date,
        default: Date.now,
    },
})

export default userModel