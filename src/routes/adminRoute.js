import adminController from "../controllers/adminController"

const adminRouter = (app) =>
{
    app.route("/admin/users")
        .post(adminController.getUsers)
}

export default adminRouter