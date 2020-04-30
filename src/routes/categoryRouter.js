import categoryController from "../controllers/categoryController"

const categoryRouter = (app) =>
{
    app.route("/category")
        .get(categoryController.get)
        .post(categoryController.create)
}

export default categoryRouter