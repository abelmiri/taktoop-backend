import tokenHelper from "./tokenHelper"

const addHeaderAndCheckPermissions = (app) =>
{
    app.use((req, res, next) =>
    {
        res.setHeader("Access-Control-Allow-Origin", "*")
        if (
            req.originalUrl === "/" ||
            (req.originalUrl.slice(0, 17) === "/user/phone-check" && req.method === "POST") ||
            (req.originalUrl.slice(0, 17) === "/user/email-check" && req.method === "POST") ||
            (req.originalUrl.slice(0, 11) === "/user/login" && req.method === "POST") ||
            (req.originalUrl.slice(0, 13) === "/user/sign-up" && req.method === "POST") ||
            (req.originalUrl.slice(0, 9) === "/category" && req.method === "GET") ||
            (req.originalUrl.slice(0, 5) === "/post" && req.method === "GET")
        )
        {
            if (req.headers.authorization)
            {
                delete req.headers.authorization
                next()
            }
            else next()
        }
        else if (
            req.originalUrl.slice(0, 5) === "/user" ||
            req.originalUrl.slice(0, 9) === "/category" ||
            req.originalUrl.slice(0, 5) === "/post" ||
            req.originalUrl.slice(0, 5) === "/post-description"
        )
        {
            if (req.headers.authorization)
            {
                tokenHelper.decodeToken(req.headers.authorization)
                    .then((payload) =>
                    {
                        req.headers.authorization = {...payload}
                        next()
                    })
                    .catch((result) => res.status(result.status || 403).send(result.err))
            }
            else res.status(401).sendFile(__dirname.slice(0, -10) + "/401/index.html")
        }
        else next()
    })
}

export default addHeaderAndCheckPermissions
