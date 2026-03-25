import { Router } from "express";
import { UserModel } from "../../Models/Users/UserModel";
import { UserFriendModel } from "../../Models/Users/Friends/UserFriendModel";

const router = Router();

router.post("/", async (req, res) => {
    let userId = req.body.userId;

    if (!userId || typeof userId !== "string") {
        return res.json({
            error: "Invalid userId"
        })
    }

    const friendsData = await UserFriendModel.findAll({
        where: {
            userId
        },
        include: [
            {
                model: UserModel,
                as: "friend"
            }
        ]
    });

    const friends: Array<any> = [];

    friendsData.forEach((userFriend) => {
        friends.push({
            id: userFriend.friend.id,
            name: userFriend.friend.name,
            motto: userFriend.friend.motto,
            figureConfiguration: userFriend.friend.figureConfiguration,
            online: userFriend.friend.online
        })
    });

    return res.json(friends.sort((a, b) => Number(b.online) - Number(a.online)));
});

export default router;