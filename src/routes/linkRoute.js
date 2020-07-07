import linkController from "../controllers/linkController"

const linkRouter = (app) =>
{
    app.route("/link")
        .get(linkController.get)
        .post(linkController.create)
        .patch(linkController.update)
        .delete(linkController.deleteOne)
}

export default linkRouter