import { Router } from "express";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import jsonWebToken from "jsonwebtoken";
import { UserPreferenceModel } from "../../../Models/Users/Preferences/UserPreferences";
import { randomUUID } from 'crypto';

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        allowFriendsRequest = req.body.allowFriendsRequest,
        allowFriendsFollow = req.body.allowFriendsFollow;

        console.log(req.body)

    if (!accessToken) {
        return res.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return res.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return res.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return res.json({
                error: "An error occured"
            });

        if (typeof allowFriendsRequest !== "boolean" || typeof allowFriendsFollow !== "boolean") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        let userPreferences = await UserPreferenceModel.findOne({
            where: {
                userId: user.id
            }
        });

        if (!userPreferences) {
            userPreferences = await UserPreferenceModel.create({
                id: randomUUID(),
                userId: user.id
            });
        }

        await userPreferences.update({
            allowFriendsRequest,
            allowFriendsFollow
        })

        return res.json({
            success: "Your friends settings has been edited."
        });

    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;