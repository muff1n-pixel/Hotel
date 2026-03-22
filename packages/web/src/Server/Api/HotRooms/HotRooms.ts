import { Router } from "express";
import { RoomModel } from "../../Models/Rooms/RoomModel";
import { UserModel } from "../../Models/Users/UserModel";

const router = Router();

router.post("/", async (req, res) => {
    let limit = req.body.limit;

    if (!limit || isNaN(parseInt(limit)) || parseInt(limit) > 50)
        limit = 5;

    const hotRooms = await RoomModel.findAll({
        where: {
            lock: "open"
        },
        order: [['currentUsers', 'DESC']],
        limit: parseInt(limit),
        include: [{ model: UserModel, as: "owner" }]
    });

    let rooms: any = [];

    hotRooms.forEach((room) => {
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