import postController from "../controllers/postController"

const postRouter = (app) =>
{
    app.route("/post")
        .get(postController.get)
        .post(postController.create)
        .patch(postController.update)
        .delete(postController.deleteOne)

    app.route("/post-like")
        .post(postController.addNewLike)
        .delete(postController.deleteLike)

    app.route("/bold-post")
        .get(postController.getBoldPosts)

    app.route("/predict-post")
        .get(postController.getPredictPosts)

    app.route("/most-viewed-post")
        .get(postController.getMostViewedPosts)

    app.route("/most-liked-post")
        .get(postController.getMostLikedPosts)

    app.route("/category-post")
        .get(postController.getCategoryPosts)

    app.route("/post-description")
        .post(postController.createUpdatePostDescription)
        .patch(postController.createUpdatePostDescription)
        .delete(postController.deletePostDescription)
}

export default postRouter