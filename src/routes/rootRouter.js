const rootRouter = (app) =>
{
    app.route("/")
        .get((req, res) => res.status(200).sendFile(__dirname.slice(0, -7) + "/200/index.html"))
        .post((req, res) => res.status(200).sendFile(__dirname.slice(0, -7) + "/200/index.html"))
        .patch((req, res) => res.status(200).sendFile(__dirname.slice(0, -7) + "/200/index.html"))
        .delete((req, res) => res.status(200).sendFile(__dirname.slice(0, -7) + "/200/index.html"))
}

export default rootRouter