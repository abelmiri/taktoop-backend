import fs from "fs"

const deleteFile = ({path}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (path)
        {
            fs.unlink(`${__dirname}/..${path}`, err =>
            {
                if (err) reject(err)
                else resolve("deleted")
            })
        }
        else resolve(undefined)
    })
}

export default deleteFile