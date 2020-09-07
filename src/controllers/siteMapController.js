import mongoose from "mongoose"
import categoryModel from "../models/categoryModel";
import postModel from "../models/postModel";

const Category = mongoose.model("category", categoryModel)
const Post = mongoose.model("post", postModel)

const getRoutes = (req, res) =>
{
    let routes = "https://www.analyz.site\nhttps://www.analyz.site/about-us\n"
    getCategories(routes)
        .then((categoryList) =>
            {
                getPosts(categoryList)
                    .then((postList) => res.send(postList))
                    .catch((err) => res.status(500).send(err))
            }
        )
        .catch((err) => res.status(500).send(err))
}

const getCategories = (list) =>
{
    return new Promise((resolve, reject) =>
    {
        Category.find(null, {_id: 1}, null, (err, cats) =>
        {
            if (err) reject({status: 500, err})
            else
            {
                let categories = list
                cats.forEach((cat) => categories += `https://www.analyz.site/category/${cat._id}\n`)
                resolve(categories)
            }
        })
    })
}

const getPosts = (list) =>
{
    return new Promise((resolve, reject) =>
    {
        Post.find(null, {title: 1}, null, (err, cats) =>
        {
            if (err) reject({status: 500, err})
            else
            {
                let posts = list
                cats.forEach((cat) => posts += `https://www.analyz.site/post/${cat.title}\n`)
                resolve(posts)
            }
        })
    })
}

const userController = {
    getRoutes,
}

export default userController