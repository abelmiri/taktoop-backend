import postController from "../controllers/postController"

const postRouter = (app) =>
{
    app.route("/post")
        .get(postController.get)
        .post(postController.create)

    app.route("/post-description")
        .post(postController.createUpdatePostDescription)
}

export default postRouter