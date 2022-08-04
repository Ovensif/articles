import { NextApiRequest, NextApiResponse } from "next"
import { prisma } from "../../database/prisma"

async function login(req: NextApiRequest, res: NextApiResponse) {

    const param = req.body
    const bcrypt = require('bcrypt');

    if (!param.username || !param.password) return res.status(400).json({ status: false, message: "Either username or password cannot be empty!"})

    // Check if user exist
    const checkUser = await prisma.tb_users.findFirst({
        where: {
            user_email: param.username
        }
    })

    // Checking legitament user!
    if (checkUser === null) return res.status(404).json({status  : false, message : "No user found!"})

    const passwordMatch = await bcrypt.compare(param.password, checkUser.password)

    if(!passwordMatch) return res.status(400).json({status  : false, message : "Wrong password!"})

    // Return the correct one!
    return res.status(200).json({status  : true, message : "Your password is correct!"})
}

export default login