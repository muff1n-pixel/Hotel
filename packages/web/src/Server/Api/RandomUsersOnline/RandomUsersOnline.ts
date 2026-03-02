import { Router } from "express";
import Sequelize, { and } from 'sequelize';
import { UserModel } from "../../Models/Users/UserModel";

const router = Router();

router.post("/", async (req, res) => {
    const usersOnline = await UserModel.findAll({
        where: {
            online: true
        },
        order: Sequelize.literal('rand()'),
        limit: 18
    });

    const usersData: Array<any> = [];
    usersOnline.forEach((user: any)=> {
        usersData.push({
            id: user.id,
            name: user.name,
            motto: user.motto,
            figureConfiguration: user.figureConfiguration
        })
    });

    return res.json(usersData);
});

export default router;