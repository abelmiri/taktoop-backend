import userController from "../controllers/userController"

const userRouter = (app) =>
{
    app.route("/user/phone-check")
        .post(userController.phoneCheck)

    app.route("/user/email-check")
        .post(userController.emailCheck)

    app.route("/user/login")
        .post(userController.login)

    app.route("/user/sign-up")
        .post(userController.signUp)

    app.route("/user/update")
        .patch(userController.update)

    app.route("/user/password")
        .post(userController.changePassword)

    app.route("/user/verify-token")
        .post(userController.verifyTokenRoute)
}

export default userRouter