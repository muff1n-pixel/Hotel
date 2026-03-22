import { Router } from "express";
import { RoomModel } from "../../Models/Rooms/RoomModel";
import { UserModel } from "../../Models/Users/UserModel";

const router = Router();

router.post("/", async (req, res) => {
    let ownerId = req.body.ownerId;

    if (!ownerId || typeof ownerId !== "string") {
        return res.json({
            error: "Invalid ownerId"
        })
    }

    const roomsData = await RoomModel.findAll({
        where: {
            ownerId
        },
        order: [['createdAt', 'DESC']],
        include: [{ model: UserModel, as: "owner" }]
    });

    let rooms: any = [];

    roomsData.forEach((room) => {
        rooms.push({
            id: room.id,
            type: room.type,
            name: room.name,
            description: room.description,
            owner: room.owner ? {
                id: room.owner.id,
                name: room.owner.name
            } : null,
            thumbnail: room.thumbnail,
            currentUsers: room.currentUsers,
            maxUsers: room.maxUsers
        })
    });

    return res.json(rooms);
});

export default router;