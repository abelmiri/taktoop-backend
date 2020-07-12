import mongoose from "mongoose"
import linksModel from "../models/linksModel"
import userController from "../controllers/userController"

const link = mongoose.model("link", linksModel)

const create = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin")
            {
                delete req.body.created_date
                const newLink = new link({...req.body, creator_id: _id})
                newLink.save((err, newLink) =>
                {
                    if (err) res.status(400).send(err)
                    else res.send(newLink)
                })
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const get = (req, res) =>
{
    const {all} = req.query
    all ? link.find(null, null, {sort: "-created_date"}, (err, links) => err ? res.status(500).send(err) : res.send(links))
        : link.find(null, null, {sort: "-created_date"}, (err, links) => err ? res.status(500).send(err) : res.send(links[0]))
}

const update = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin")
                {
                    delete req.body.created_date
                    delete req.body.creator_id
                    link.findOneAndUpdate(
                        {_id: req.body._id},
                        {...req.body},
                        {new: true, useFindAndModify: false, runValidators: true},
                        (err, updated) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.status(200).send(updated)
                        })
                }
                else res.status(401).send({message: "permission denied babe"})
            },
        )
}

const deleteOne = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin")
                {
                    link.findByIdAndDelete(
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

const categoryController = {
    create,
    get,
    update,
    deleteOne,
}

export default categoryController