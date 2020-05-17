import fs from "fs"

const loadFile = ({fileName, encode = "utf-8"}) =>
{
    return new Promise((resolve, reject) =>
    {
        if (fileName)
        {
            fs.readFile(`${__dirname}/../media/${fileName}`, encode, (err, data) =>
            {
                if (err) reject(err)
                else resolve(data)
            })
        }
        else resolve(undefined)
    })
}

export default loadFile