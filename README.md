# taktoop-backend
**a cool, secure and fast API based on node, express and mongo ;)**
## api routes
> /post
###### posts model:
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
    creator_id: { // Don't Send
        type: schema.Types.ObjectId,
    },
    created_date: { // Don't Send
        type: Date,
        default: Date.now,
    },
})
```
> /post-description
###### post descriptions model:
```
const postDescriptionModel = new schema({
    post_id: {
        type: schema.Types.ObjectId,
        index: true,
        required: "Enter post_id!",
    },
    type: {
        type: String,
        enum: ["description", "bold", "picture", "video"],
        default: "description",
        required: "Enter type!",
        trim: true,
    },
    content: String,
    order: Number,
    creator_id: { // Don't Send
        type: schema.Types.ObjectId, 
    },
    created_date: { // Don't Send
        type: Date,
        default: Date.now,
    },
})
```
> /user/login

> /user/sign-up

> /user/update

> /user/email-check

> /user/phone-check
###### users model:
```
const userModel = new schema({
    phone: { // Don't Send for sign-up (send for update)
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
    picture: { // Don't Send for sign-up (send for update)
        type: String,
    },
    role: { // Don't Send
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
    created_date: { // Don't Send
        type: Date,
        default: Date.now,
    },
})
```
> /category
###### categories model:
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
    parent_id: { // Don't Send for Main Categoies
        type: schema.Types.ObjectId,
        default: null,
    },
    slider_picture: { // Send for Main Categories
        type: String,
    },
    menu_picture: { // Send for Main Categories
        type: String,
    },
    created_date: { // Don't Send
        type: Date,
        default: Date.now,
    },
})
```
