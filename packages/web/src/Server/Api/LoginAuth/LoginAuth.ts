import { Router } from "express";
import { UserTokenModel } from "../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../Models/Users/UserModel";
import { UserPreferenceModel } from "../../Models/Users/Preferences/UserPreferences";
import { randomUUID } from 'crypto';
import jsonWebToken from "jsonwebtoken";

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

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            lastLogin: user.lastLogin,
            credits: user.credits,
            diamonds: user.diamonds,
            duckets: user.duckets,
            motto: user.motto,

            preferences: {
                allowFriendsFollow: userPreferences.allowFriendsFollow,
                allowFriendsRequest: userPreferences.allowFriendsRequest
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