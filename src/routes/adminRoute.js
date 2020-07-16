import adminController from "../controllers/adminController"

const adminRouter = (app) =>
{
    app.route("/admin/users")
        .get(adminController.getUsers)

    app.route("/admin/change-role")
        .post(adminController.changeRole)
}

export default adminRouter