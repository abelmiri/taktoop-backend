import mongoose from "mongoose"
import userModel from "../models/userModel"
import tokenHelper from "../functions/tokenHelper"
import numberCorrection from "../functions/numberCorrection"
import saveFile from "../functions/saveFile"

const user = mongoose.model("user", userModel)

const getUser = (id) =>
{
    return new Promise((resolve, reject) =>
        user.findById(id, {name: 1, picture: 1}, (err, user) =>
        {
            if (err) reject({status: 500, err})
            else resolve(user)
        }),
    )
}

const phoneCheck = (req, res) =>
{
    const {phone} = req.body
    if (phone.trim().length === 11)
        user.find({phone: numberCorrection(phone)}, {phone: 1}, (err, users) =>
        {
            if (err) res.status(500).send(err)
            else if (users) res.send({count: users.length})
            else res.send({count: 0})
        })
    else res.status(400).send({message: "please don't send shit."})
}

const emailCheck = (req, res) =>
{
    const {email} = req.body
    if (email)
        user.find({email}, {email: 1}, (err, users) =>
        {
            if (err) res.status(500).send(err)
            else if (users) res.send({count: users.length})
            else res.send({count: 0})
        })
    else res.status(400).send({message: "please send some shit."})
}

const login = (req, res) =>
{
    const {phone, email, password} = req.body
    if (phone || email)
    {
        userExist({phone, email})
            .then((result) =>
            {
                const {user} = result
                if (password === user.password)
                    tokenHelper.encodeToken(user.phone ? {_id: user._id, phone: user.phone, email: user.email} : {_id: user._id, email: user.email})
                        .then((token) => res.send({...user, token}))
                        .catch((err) => res.status(500).send({message: err}))
                else res.status(401).send({message: "wrong password"})
            })
            .catch(() =>
            {
                res.status(404).send({message: "user not found"})
            })
    }
}

const signUp = (req, res) =>
{
    const {email, name, password} = req.body
    userExist({email})
        .then(() =>
        {
            res.status(400).send({message: "user already exist"})
        })
        .catch(() =>
        {
            const newUser = new user({name, email, password})
            newUser.save((err, createdUser) =>
            {
                if (err) res.status(500).send(err)
                else
                {
                    const user = createdUser.toJSON()
                    tokenHelper.encodeToken({_id: user._id, email: user.email, phone: null})
                        .then((token) => res.send({...user, token}))
                        .catch((err) => res.status(500).send({message: err}))
                }
            })
        })
}

const update = (req, res) =>
{
    const {_id, password} = req.body
    const {picture} = req.files
    delete req.body.created_date
    delete req.body.role
    if (picture)
        saveFile({folder: "pictures", file: picture})
            .then((profileMediaAddress) =>
                {
                    user.findOneAndUpdate(
                        {_id, password},
                        {...req.body, picture: profileMediaAddress},
                        {new: true, useFindAndModify: false, runValidators: true},
                        (err, updated) =>
                        {
                            if (err) res.status(500).send(err)
                            else res.status(200).send(updated)
                        })
                },
            )
            .catch((profileMediaResultErr) => res.status(500).send({message: "user media saving error", profileMediaResultErr}))
    else user.findByIdAndUpdate(
        {_id, password},
        req.body,
        {new: true, useFindAndModify: false, runValidators: true},
        (err, updated) =>
        {
            if (err) res.status(500).send(err)
            else res.status(200).send(updated)
        },
    )
}

const verifyToken = ({_id, email, phone}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (_id && email)
        {
            user.findOne(phone ? {_id, email, phone} : {_id, email}, (err, takenUser) =>
            {
                if (err) reject({status: 500, err})
                else if (!takenUser) reject({status: 403, err: {message: "token is not valid!"}})
                else resolve({status: 200, err: {message: "it's valid babe!"}, user: takenUser.toJSON()})
            })
        }
        else reject({status: 403, err: {message: "token is not valid!"}})
    })
}

const verifyTokenRoute = (req, res) =>
{
    const {_id} = req.headers.authorization
    user.findById(_id, (err, takenUser) =>
    {
        if (err) res.status(500).send(err)
        else
        {
            const user = takenUser.toJSON()
            res.send({...user})
        }
    })
}

const userExist = ({phone, email}) =>
{
    return new Promise((resolve, reject) =>
    {
        user.findOne(phone ? {phone: numberCorrection(phone)} : {email}, (err, takenUser) =>
        {
            if (err) reject({status: 500, err})
            else if (!takenUser) reject({status: 404, err: {message: "user not found!"}})
            else resolve({status: 200, user: takenUser.toJSON()})
        })
    })
}

const userController = {
    getUser,
    phoneCheck,
    emailCheck,
    login,
    signUp,
    update,
    verifyToken,
    verifyTokenRoute,
}

export default userController