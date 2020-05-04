import categoryController from "../controllers/categoryController"

const categoryRouter = (app) =>
{
    app.route("/category")
        .get(categoryController.get)
        .post(categoryController.create)
        .update(categoryController.update)
        .delete(categoryController.deleteOne)
}

export default categoryRouter