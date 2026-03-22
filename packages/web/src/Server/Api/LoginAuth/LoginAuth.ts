import { Router } from "express";
import { UserTokenModel } from "../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../Models/Users/UserModel";
import { UserPreferenceModel } from "../../Models/Users/Preferences/UserPreferences";
import { randomUUID } from 'crypto';
import jsonWebToken from "jsonwebtoken";
import { sendLog } from "@shared/Logger/LoggerEx";
import { UserFriendModel } from "../../Models/Users/Friends/UserFriendModel";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.redirect("/logout");
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return res.json({
            error: "Invalid token"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return res.json({
                error: "Invalid token"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null) {
            return res.json({
                error: "Invalid token"
            });
        }

        const [userPreferences] = await UserPreferenceModel.findOrCreate({
            where: {
                userId: user.id
            },
            defaults: {
                id: randomUUID()
            }
        });

        const friendsData = await UserFriendModel.findAll({
            where: {
                userId: user.id
            },
            include: [
                {
                    model: UserModel,
                    as: "friend"
                }
            ]
        });

        const friends: Array<any> = [];

        for await (const userFriend of friendsData) {
            friends.push({
                id: userFriend.friend.id,
                name: userFriend.friend.name,
                figureConfiguration: userFriend.friend.figureConfiguration,
                online: userFriend.friend.online
            })
        }

        sendLog("VERBOSE", `${user.name} just logged in (Auth) from website.`);

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin,
            credits: user.credits,
            diamonds: user.diamonds,
            duckets: user.duckets,
            motto: user.motto,
            figureConfiguration: user.figureConfiguration,
            friends: friends,

            preferences: {
                allowFriendsFollow: userPreferences.allowFriendsFollow,
                allowFriendsRequest: userPreferences.allowFriendsRequest,
                allowTrade: userPreferences.allowTrade
            }
        });
    }
    catch (e) {
        return res.json({
            error: "Invalid token"
        });
    }
});

export default router;