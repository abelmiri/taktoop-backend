const rootRouter = (app) =>
{
    app.route("/")
        .get((req, res) => res.send("welcome to the taktoopcasino.com api"))
        .post((req, res) => res.send("welcome to the taktoopcasino.com api"))
        .patch((req, res) => res.send("welcome to the taktoopcasino.com api"))
        .delete((req, res) => res.send("welcome to the taktoopcasino.com api"))
}

export default rootRouter