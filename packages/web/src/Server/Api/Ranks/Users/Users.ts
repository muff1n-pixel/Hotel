import { Router } from "express";
import { UserModel } from "../../../Models/Users/UserModel";
import { PermissionRoleModel } from "../../../Models/Permissions/PermissionRoleModel";
import { Op, Sequelize } from 'sequelize';
import { UserBadgeModel } from "../../../Models/Users/Badges/UserBadgeModel";
import { BadgeModel } from "../../../Models/Badges/BadgeModel";

const router = Router();

router.post("/", async (req, res) => {
    const roles = req.body.roles;

    if (!roles || !Array.isArray(roles))
        return res.json({
            error: "Invalid data sent."
        });

    const userData: Array<any> = [];

    for await (const role of roles) {
        if (typeof role !== 'string')
            return res.json({
                error: "Invalid data sent."
            })

        const roleData = await PermissionRoleModel.findOne({
            where: {
                id: role
            }
        });

        if (!roleData)
            return res.json({
                error: "Invalid data sent."
            })

        const users = await UserModel.findAll({
            include: [{ model: PermissionRoleModel, as: "roles" }],
            where: {
                '$roles.id$': {
                    [Op.in]: [roleData.id]
                }
            },
        });

        for await (const user of users) {

            let userCurrentBadges: Array<string> = [];
            const userBadgesData = await UserBadgeModel.findAll({
                where: {
                    userId: user.id,
                    equipped: true
                },
                include: {
                    model: BadgeModel,
                    as: "badge"
                },
                order: [['updatedAt', 'ASC']]
            });

            for await (const badgeData of userBadgesData) {
                if(!badgeData.badge)
                    continue;
                
                userCurrentBadges.push(badgeData.badge.image)
            }

            userData.push({
                id: user.id,
                name: user.name,
                role: roleData.name,
                motto: user.motto,
                figureConfiguration: user.figureConfiguration,
                online: user.online,
                currentBadges: userCurrentBadges
            })
        }
    }

    return res.json(userData);
});

export default router;