import type { NextApiRequest, NextApiResponse } from 'next'
import { exit } from 'process';
import { prisma } from "../../../database/prisma";

async function create(req: NextApiRequest, res: NextApiResponse) {

    if (req.method != 'POST') {
        return res.status(405).json({ status: false, message: "Methode not allowed" })
    }

    const param = req.body
    const bcrypt = require('bcrypt');

    if (!param.username || !param.password || !param.email) {
        return res.status(400).json({ status: false, message: "Username, password or email cannot be empty!" })
    }    

    let username = param.username
    let password = bcrypt.hashSync(param.password, 10)
    let email = param.email
    let datetime = new Date() // This part only saving date but not time for now!

    // Store user
    const storeUser = await prisma.tb_users.create({
        data : {
            username : username,
            user_email : email,
            password : password,
            created_by : 1,
            created_date : datetime
        }
    })

    if(storeUser.id > 1){
        return res.status(200).json({
            status : true,
            message : "Successfully created new user!", 
            data : storeUser
        })
    }else {
        return res.status(500).json({
            status : false,
            message : "Failed create new user!"
        })
    }
    
}

export default create