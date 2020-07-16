import mongoose from "mongoose"
import postModel from "../models/postModel"
import postLikeModel from "../models/postLikeModel"
import postDescriptionModel from "../models/postDescriptionModel"
import userController from "../controllers/userController"
import saveFile from "../functions/saveFile"
import deleteFile from "../functions/deleteFile"

const Post = mongoose.model("post", postModel)
const PostLikeModel = mongoose.model("postLike", postLikeModel)
const PostDescription = mongoose.model("postDescription", postDescriptionModel)

const create = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin" || result.user.role === "system")
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
            if (result.user.role === "admin" || result.user.role === "system")
            {
                const {is_predict} = req.body
                if (is_predict === "null" || is_predict === null)
                {
                    Post.findOneAndUpdate(
                        {_id: req.body._id},
                        {$unset: {is_predict: ""}},
                        {new: true, useFindAndModify: false, runValidators: true},
                        (err, _) =>
                        {
                            if (err) res.status(500).send(err)
                            else
                            {
                                delete req.body.is_predict
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
                        })
                }
                else
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
                if (result.user.role === "admin" || result.user.role === "system")
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
            if (result.user.role === "admin" || result.user.role === "system")
            {
                const {type} = req.body
                delete req.body.created_date
                delete req.body.creator_id

                if (req.body._id && req.body.order && !req.body.content && !req.body.type && !req.body.post_id)
                {
                    PostDescription.findOneAndUpdate(
                        {_id: req.body._id},
                        req.body,
                        {new: true, useFindAndModify: false, runValidators: true},
                        (err, updated) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.status(200).send(updated)
                        })
                }
                else if (type === "description" || type === "bold")
                {
                    if (req.body._id)
                    {
                        PostDescription.findOneAndUpdate(
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
                                        PostDescription.findOneAndUpdate(
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
                    else
                    {
                        res.status(400).send({message: "where is the content?"})
                    }
                }
                else res.status(400).send({message: "where is the content?"})
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const get = (req, res) =>
{
    const {title, page, category_id} = req.query
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10
    const skip = (page - 1 > 0 ? page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}
    Post.find(title ? {title} : category_id ? {category_id} : null, null, options, (err, posts) =>
    {
        if (err) res.status(500).send(err)
        else if (title)
        {
            posts[0] ? addNewView(posts[0]._id)
                    .then(_ =>
                    {
                        PostDescription.find({post_id: posts[0]._id}, null, {sort: "order"}, (err, postDescriptions) =>
                        {
                            if (err) res.status(500).send(err)
                            else
                            {
                                if (req.headers.authorization)
                                {
                                    const user_id = req.headers.authorization._id
                                    PostLikeModel.findOne({user_id, post_id: posts[0]._id}, (err, takenLike) =>
                                    {
                                        if (err) res.status(500).send(err)
                                        else
                                        {
                                            const is_liked = takenLike !== null
                                            userController.getUser(posts[0].creator_id)
                                                .then(briefUser =>
                                                {
                                                    let fullPost = {...posts[0]._doc}
                                                    fullPost.creator_name = briefUser.name
                                                    fullPost.creator_picture = briefUser.picture
                                                    fullPost.post_descriptions = postDescriptions
                                                    fullPost.is_liked = is_liked
                                                    res.send(fullPost)
                                                })
                                                .catch(error =>
                                                {
                                                    console.log("user fetch error", error)
                                                    let fullPost = {...posts[0]._doc}
                                                    fullPost.post_descriptions = postDescriptions
                                                    fullPost.is_liked = is_liked
                                                    res.send(fullPost)
                                                })
                                        }
                                    })
                                }
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
                            }
                        })
                    })
                    .catch(_err => res.status(500).send(_err))
                : res.status(404).send({message: "post not found"})
        }
        else
        {
            if (req.headers.authorization)
            {
                const user_id = req.headers.authorization._id
                PostLikeModel.find({user_id, post_id: {$in: posts.reduce((sum, post) => [...sum, post._id], [])}}, (err, likes) =>
                {
                    if (err) res.status(500).send(err)
                    else
                    {
                        const postsObj = posts.reduce((sum, conversation) => ({...sum, [conversation._id]: {...conversation.toJSON()}}), {})
                        likes.forEach(like => postsObj[like.post_id].is_liked = true)
                        res.send(Object.values(postsObj))
                    }
                })
            }
            else res.send(posts)
        }
    })
}

const getBoldPosts = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 8
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}
    Post.find({is_bold: true}, null, options, (err, posts) =>
    {
        if (err) res.status(500).send(err)
        else res.send(posts)
    })
}

const getPredictPosts = (req, res) =>
{
    const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 8
    const skip = (req.query.page - 1 > 0 ? req.query.page - 1 : 0) * limit
    const options = {sort: "-created_date", skip, limit}
    Post.find({is_predict: {$gte: Date.now}}, null, options, (err, posts) =>
    {
        if (err) res.status(500).send(err)
        else res.send(posts)
    })
}

const deletePostDescription = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin" || result.user.role === "system")
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

const addNewView = (post_id) =>
{
    return new Promise(((resolve, reject) =>
            Post.findOneAndUpdate(
                {_id: post_id},
                {$inc: {views_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) reject({status: 500, err})
                    else resolve({status: 200})
                },
            )
    ))
}

const addNewLike = (req, res) =>
{
    delete req.body.created_date
    const {_id} = req.headers.authorization
    const {post_id} = req.body
    const newLike = new PostLikeModel({user_id: _id, post_id})
    newLike.save((err, createdLike) =>
    {
        if (err) res.status(400).send(err)
        else
        {
            Post.findOneAndUpdate(
                {_id: post_id},
                {$inc: {likes_count: 1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send(createdLike)
                },
            )
        }
    })
}

const deleteLike = (req, res) =>
{
    const {_id} = req.headers.authorization
    const {post_id} = req.body
    PostLikeModel.deleteOne({post_id, user_id: _id}, (err, statistic) =>
    {
        if (err) res.status(400).send(err)
        else if (statistic.deletedCount === 1)
        {
            Post.findOneAndUpdate(
                {_id: post_id},
                {$inc: {likes_count: -1}},
                {useFindAndModify: false},
                (err) =>
                {
                    if (err) res.status(500).send(err)
                    else res.send({message: "like deleted successfully"})
                },
            )
        }
        else res.status(404).send({message: "like not found!"})
    })
}

const categoryController = {
    create,
    update,
    deleteOne,
    createUpdatePostDescription,
    deletePostDescription,
    getBoldPosts,
    getPredictPosts,
    get,
    addNewLike,
    deleteLike,
}

export default categoryController