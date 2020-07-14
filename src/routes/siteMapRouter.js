import siteMapController from "../controllers/siteMapController"

const siteMapRouter = (app) =>
{
    app.route("/site-map")
        .get(siteMapController.getRoutes)
}

export default siteMapRouter