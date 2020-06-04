import mongoose from "mongoose"
import categoryModel from "../models/categoryModel"
import userController from "../controllers/userController"
import saveFile from "../functions/saveFile"

const category = mongoose.model("category", categoryModel)

const create = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
        {
            if (result.user.role === "admin")
            {
                const {parent_id} = req.body
                if (!parent_id)
                {
                    if (req.files)
                    {
                        const {menu_picture, slider_picture} = req.files
                        if (menu_picture && slider_picture)
                        {
                            saveFile({folder: "pictures", file: menu_picture})
                                .then((menuMediaAddress) =>
                                    saveFile({folder: "pictures", file: slider_picture})
                                        .then((sliderMediaAddress) =>
                                            {
                                                delete req.body.created_date
                                                const newCategory = new category({...req.body, menu_picture: menuMediaAddress, slider_picture: sliderMediaAddress})
                                                newCategory.save((err, newCat) =>
                                                {
                                                    if (err) res.status(400).send(err)
                                                    else res.send(newCat)
                                                })
                                            },
                                        )
                                        .catch((sliderMediaResultErr) => res.status(500).send({message: "slider media saving error", sliderMediaResultErr})),
                                )
                                .catch((menuMediaResultErr) => res.status(500).send({message: "menu media saving error", menuMediaResultErr}))
                        }
                        else res.status(400).send({message: "send menu_picture && slider_picture for category"})
                    }
                    else res.status(400).send({message: "send media for category"})
                }
                else
                {
                    delete req.body.created_date
                    const newCategory = new category({...req.body})
                    newCategory.save((err, newCat) =>
                    {
                        if (err) res.status(400).send(err)
                        else res.send(newCat)
                    })
                }
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const get = (req, res) => category.find(null, null, {sort: "-created-date"}, (err, categories) => err ? res.status(500).send(err) : res.send(categories))

const update = (req, res) =>
{
    const {_id, email, phone} = req.headers.authorization
    userController.verifyToken({_id, email, phone})
        .then((result) =>
            {
                if (result.user.role === "admin")
                {
                    delete req.body.created_date
                    if (req.files)
                    {
                        const {menu_picture, slider_picture} = req.files
                        if (menu_picture)
                            saveFile({folder: "pictures", file: menu_picture})
                                .then((menuMediaAddress) =>
                                    {
                                        category.findOneAndUpdate(
                                            {_id: req.body._id},
                                            {...req.body, menu_picture: menuMediaAddress},
                                            {useFindAndModify: false, runValidators: true},
                                            (err, _) =>
                                            {
                                                if (err) res.status(500).send(err)
                                                else console.log("menuMediaAddress", menuMediaAddress)
                                            })
                                    },
                                )
                                .catch((menuMediaResultErr) => res.status(500).send({message: "menu media saving error", menuMediaResultErr}))
                        if (slider_picture)
                            saveFile({folder: "pictures", file: slider_picture})
                                .then((sliderMediaAddress) =>
                                    {
                                        category.findOneAndUpdate(
                                            {_id: req.body._id},
                                            {...req.body, slider_picture: sliderMediaAddress},
                                            {useFindAndModify: false, runValidators: true},
                                            (err, _) =>
                                            {
                                                if (err) res.status(500).send(err)
                                                else console.log("sliderMediaAddress", sliderMediaAddress)
                                            })
                                    },
                                )
                                .catch((sliderMediaResultErr) => res.status(500).send({message: "slider media saving error", sliderMediaResultErr}))
                        else if (!(menu_picture && slider_picture)) res.status(400).send({message: "send menu_picture || slider_picture for category"})
                    }
                    category.findOneAndUpdate(
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
                    category.remove(
                        {$or: [{_id: req.body._id}, {parent_id: req.body._id}]},
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