import mongoose from "mongoose"
import userModel from "../models/userModel"

const user = mongoose.model("user", userModel)

const getUsers = (req, res) =>
{
    const {_id, email} = req.headers.authorization
    verifyAdminToken({_id, email})
        .then(_ =>
        {
            user.find(null, {_id: 1, role: 1, name: 1, email: 1, created_date: 1}, (err, users) =>
            {
                if (err) res.status(500).send(err)
                else res.status(200).send(users)
            })
        })
        .catch(err => res.status(err.status).send(err.err))
}

const changeRole = (req, res) =>
{
    const {_id, email} = req.headers.authorization
    verifyAdminToken({_id, email})
        .then(_ =>
        {
            const {role, user_id} = req.body
            user.findByIdAndUpdate(
                {_id: user_id},
                {role},
                {new: true, useFindAndModify: false, runValidators: true},
                (err, updated) =>
                {
                    if (err) res.status(500).send(err)
                    else res.status(200).send(updated)
                },
            )
        })
        .catch(err => res.status(err.status).send(err.err))
}

const verifyAdminToken = ({_id, email}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (_id && email)
        {
            user.findOne({_id, email, role: "system"}, (err, takenUser) =>
            {
                if (err) reject({status: 500, err})
                else if (!takenUser) reject({status: 403, err: {message: "token is not valid!"}})
                else resolve({status: 200, err: {message: "it's valid babe!"}, user: takenUser.toJSON()})
            })
        }
        else reject({status: 403, err: {message: "token is not valid!"}})
    })
}

const adminController = {
    getUsers,
    changeRole,
    verifyAdminToken,
}

export default adminController