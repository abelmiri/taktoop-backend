import mongoose from "mongoose"
import postModel from "../models/postModel"
import postDescriptionModel from "../models/postDescriptionModel"
import userController from "../controllers/userController"
import saveFile from "../functions/saveFile"

const Post = mongoose.model("post", postModel)
const PostDescription = mongoose.model("postDescription", postDescriptionModel)

const create = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin")
            {
                const {picture} = req.files
                if (picture)
                {
                    saveFile({folder: "pictures", file: picture})
                        .then((postMediaAddress) =>
                            {
                                delete req.body.created_date
                                delete req.body.creator_id

                                const newPost = new Post({...req.body, picture: postMediaAddress})
                                newPost.save((err, post) =>
                                {
                                    if (err) res.status(400).send(err)
                                    else res.send(post)
                                })
                            },
                        )
                        .catch((postMediaResultErr) => res.status(500).send({message: "post media saving error", postMediaResultErr}))
                }
                else res.status(400).send({message: "where is the picture?"})
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const createUpdatePostDescription = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin")
            {
                const {type} = req.body
                delete req.body.created_date
                delete req.body.creator_id

                if (type === "description" || type === "bold")
                {
                    if (req.body._id)
                    {
                        PostDescription.findOneAndReplace(
                            {_id: req.body._id},
                            req.body,
                            {new: true, useFindAndModify: false, runValidators: true},
                            (err, updated) =>
                            {
                                if (err) res.status(500).send(err)
                                else res.status(200).send(updated)
                            })
                    }
                    else
                    {
                        const newPostDescription = new PostDescription({...req.body, creator_id: _id})
                        newPostDescription.save((err, post) =>
                        {
                            if (err) res.status(400).send(err)
                            else res.send(post)
                        })
                    }
                }
                else if (type === "picture" || type === "video")
                {
                    const {content} = req.files
                    if (content)
                    {
                        saveFile({folder: "pictures", file: content})
                            .then((postMediaAddress) =>
                                {
                                    delete req.body.created_date
                                    delete req.body.creator_id

                                    const newPostDescription = new PostDescription({...req.body, picture: postMediaAddress, creator_id: _id})
                                    newPostDescription.save((err, post) =>
                                    {
                                        if (err) res.status(400).send(err)
                                        else res.send(post)
                                    })
                                },
                            )
                            .catch((postMediaResultErr) => res.status(500).send({message: "post description media saving error", postMediaResultErr}))
                    }
                    else res.status(400).send({message: "where is the content?"})
                }
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const get = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}
    const title = req.body
    Post.find(req.body, null, options, (err, posts) =>
    {
        if (err) res.status(500).send(err)
        else if (title)
        {
            PostDescription.find({post_id: title}, (err, postDescriptions) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    userController.getUser(posts.creator_id)
                        .then(briefUser =>
                        {
                            posts.post_descriptions = postDescriptions
                            posts.creator_name = briefUser.name
                            posts.creator_picture = briefUser.picture
                            res.send(posts)
                        })
                        .catch(error =>
                        {
                            console.log(error)
                            posts.post_descriptions = postDescriptions
                            res.send(posts)
                        })
                }
            })
        }
        else res.send(posts)
    })
}

const categoryController = {
    create,
    createUpdatePostDescription,
    get,
}

export default categoryController