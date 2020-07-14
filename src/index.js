import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import fileUpload from "express-fileupload"
import mongoose from "mongoose"
import adminRouter from "./routes/adminRoute";
import categoryRouter from "./routes/categoryRouter"
import linkRouter from "./routes/linkRoute"
import postRouter from "./routes/postRouter"
import rootRouter from "./routes/rootRouter"
import siteMapRouter from "./routes/siteMapRouter";
import userRouter from "./routes/userRouter"
import addHeaderAndCheckPermissions from "./functions/addHeaderAndCheckPermissions"
import notFoundRooter from "./routes/notFoundRouter"
import data from "./data"

// Normal Things Never Leave Us Alone ...
const app = express()
app.use(cors())
app.use(fileUpload({createParentPath: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// Connecting To DB (data file is private babes 😊)
mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, {useNewUrlParser: true}).then(() => console.log("connected to db"))

// Add Header To All Responses & Token Things
addHeaderAndCheckPermissions(app)

// Routing Shits
rootRouter(app)
adminRouter(app)
categoryRouter(app)
postRouter(app)
linkRouter(app)
userRouter(app)
siteMapRouter(app)
notFoundRooter(app) // & at the end

// Eventually Run The Fucking Server
app.listen(data.port, () => console.log(`Taktoop Backend is Now Running on Port ${data.port}`))