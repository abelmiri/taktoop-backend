import postController from "../controllers/postController"

const postRouter = (app) =>
{
    app.route("/post")
        .get(postController.get)
        .post(postController.create)
        .patch(postController.update)
        .delete(postController.deleteOne)

    app.route("/post-description")
        .post(postController.createUpdatePostDescription)
        .patch(postController.createUpdatePostDescription)
}

export default postRouter