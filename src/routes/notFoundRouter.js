const notFoundRooter = (app) =>
{
    app.route("*")
        .get((req, res) => res.status(404).sendFile(__dirname.slice(0, -7) + "/404/index.html"))
        .post((req, res) => res.status(404).sendFile(__dirname.slice(0, -7) + "/404/index.html"))
        .patch((req, res) => res.status(404).sendFile(__dirname.slice(0, -7) + "/404/index.html"))
        .delete((req, res) => res.status(404).sendFile(__dirname.slice(0, -7) + "/404/index.html"))
}

export default notFoundRooter