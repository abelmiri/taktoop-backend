import mongoose from "mongoose"
import userModel from "../models/userModel"

const user = mongoose.model("user", userModel)

const getUsers = () =>
{
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
    verifyAdminToken,
}

export default adminController