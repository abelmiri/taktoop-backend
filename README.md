# taktoop-backend
**a cool, secure and fast API based on node, express and mongo ;)**
## api routes
###### /post
> posts model:
```
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
```
###### /user
> users model:
```
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
```
###### /category
> categories model:
```
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
```
