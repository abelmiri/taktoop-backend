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

                }
            }
            else res.status(401).send({message: "permission denied babe"})
        })
        .catch((result) => res.status(result.status).send({status: result.status, err: result.err}))
}

const get = (req, res) =>
{
    category.find(null, (err, categories) =>
    {
        err ?
            res.status(500).send(err) :
            res.send(categories)
    })
}

const categoryController = {
    create,
    get,
}

export default categoryController