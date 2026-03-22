import { Router } from "express";
import { RankModel } from "../../Models/Ranks/RankModel";
import { RankRoleModel } from "../../Models/Ranks/Role/RankRoleModel";
import { PermissionRoleModel } from "../../Models/Permissions/PermissionRoleModel";

const router = Router();

router.post("/", async (req, res) => {
    const ranks = await RankModel.findAll({
        order: [['priorityOrder', 'ASC']],
    });

    const ranksData: Array<any> = [];

    for await (const rank of ranks) {
        const ranksRoleData: Array<any> = [];

        const ranksRole = await RankRoleModel.findAll({
            where: {
                rankId: rank.id
            },
            order: [['priorityOrder', 'ASC']],
            include: [{ model: PermissionRoleModel, as: "role" }]
        });

        for await (const rankRole of ranksRole) {
            ranksRoleData.push({
                id: rankRole.role.id,
                name: rankRole.role.name,
                description: rankRole.role.description
            })
        }

        ranksData.push({
            id: rank.id,
            name: rank.name,
            description: rank.description,
            roles: ranksRoleData
        })
    }

    return res.json(ranksData);
});

export default router;