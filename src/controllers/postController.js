import mongoose from "mongoose"
import postModel from "../models/postModel"
import postDescriptionModel from "../models/postDescriptionModel"
import userController from "../controllers/userController"
import saveFile from "../functions/saveFile"
import deleteFile from "../functions/deleteFile"

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

                                const newPost = new Post({...req.body, picture: postMediaAddress, creator_id: _id})
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

const update = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin")
            {
                if (req.files && req.files.picture)
                {
                    const {picture} = req.files
                    saveFile({folder: "pictures", file: picture})
                        .then((postMediaAddress) =>
                            {
                                delete req.body.created_date
                                delete req.body.creator_id

                                Post.findOneAndUpdate(
                                    {_id: req.body._id},
                                    {...req.body, picture: postMediaAddress},
                                    {new: true, useFindAndModify: false, runValidators: true},
                                    (err, updated) =>
                                    {
                                        if (err) res.status(500).send(err)
                                        else res.status(200).send(updated)
                                    })
                            },
                        )
                        .catch((postMediaResultErr) => res.status(500).send({message: "post media updating error", postMediaResultErr}))
                }
                else
                {
                    delete req.body.created_date
                    delete req.body.creator_id

                    Post.findOneAndUpdate(
                        {_id: req.body._id},
                        {...req.body},
                        {new: true, useFindAndModify: false, runValidators: true},
                        (err, updated) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.status(200).send(updated)
                        })
                }
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const deleteOne = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin")
                {
                    Post.findByIdAndDelete(
                        req.body._id,
                        (err, _) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.status(200).send({status: "deleted"})
                        })
                }
                else res.status(401).send({message: "permission denied babe"})
            },
        )
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

                                    if (req.body._id)
                                    {
                                        PostDescription.findOneAndReplace(
                                            {_id: req.body._id},
                                            {...req.body, content: postMediaAddress, creator_id: _id},
                                            {new: true, useFindAndModify: false, runValidators: true},
                                            (err, updated) =>
                                            {
                                                if (err) res.status(500).send(err)
                                                else res.status(200).send(updated)
                                            })
                                    }
                                    else
                                    {
                                        const newPostDescription = new PostDescription({...req.body, content: postMediaAddress, creator_id: _id})
                                        newPostDescription.save((err, post) =>
                                        {
                                            if (err) res.status(400).send(err)
                                            else res.send(post)
                                        })
                                    }
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
    const {title, page} = req.query
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10
    const skip = (page - 1 > 0 ? page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}
    Post.find(title ? {title} : null, null, options, (err, posts) =>
    {
        if (err) res.status(500).send(err)
        else if (title)
        {
            PostDescription.find({post_id: posts[0]._id}, null, {sort: "order"}, (err, postDescriptions) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    userController.getUser(posts[0].creator_id)
                        .then(briefUser =>
                        {
                            let fullPost = {...posts[0]._doc}
                            fullPost.creator_name = briefUser.name
                            fullPost.creator_picture = briefUser.picture
                            fullPost.post_descriptions = postDescriptions
                            res.send(fullPost)
                        })
                        .catch(error =>
                        {
                            console.log("user fetch error", error)
                            let fullPost = {...posts[0]._doc}
                            fullPost.post_descriptions = postDescriptions
                            res.send(fullPost)
                        })
                }
            })
        }
        else res.send(posts)
    })
}

const deletePostDescription = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin")
                {
                    PostDescription.findById(req.body._id, (err, postDescription) =>
                    {
                        if (err) res.status(500).send(err)
                        else
                        {
                            if (postDescription)
                            {
                                if (postDescription.type === "picture" || postDescription.type === "video")
                                    deleteFile({path: postDescription.content})
                                        .then(msg =>
                                        {
                                            PostDescription.findByIdAndDelete(
                                                postDescription._id,
                                                (err, _) =>
                                                {
                                                    if (err) res.status(500).send(err)
                                                    else res.status(200).send({status: msg})
                                                })
                                        })
                                        .catch(error => res.status(500).send({status: "error while deleting content", error}))
                                else PostDescription.findByIdAndDelete(
                                    postDescription._id,
                                    (err, _) =>
                                    {
                                        if (err) res.status(500).send(err)
                                        else res.status(200).send({status: "deleted"})
                                    })
                            }
                            else res.status(404).send({status: "not found"})
                        }
                    })
                }
                else res.status(401).send({message: "permission denied babe"})
            },
        )
}

const categoryController = {
    create,
    update,
    deleteOne,
    createUpdatePostDescription,
    deletePostDescription,
    get,
}

export default categoryController