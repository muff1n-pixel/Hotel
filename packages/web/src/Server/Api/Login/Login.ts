import { Router } from "express";
import { UserModel } from "../../Models/Users/UserModel";
import bcrypt from "bcrypt";
import { randomBytes, randomUUID } from 'crypto';
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../Models/Users/UserTokens/UserTokenModel";
import { UserPreferenceModel } from "../../Models/Users/Preferences/UserPreferences";

const router = Router();

router.post("/", async (req, res) => {
    const name = req.body.name;

    if (!name) {
        return res.json({
            error: "No user name provided."
        });
    }

    const password = req.body.password;

    if (!password) {
        return res.json({
            error: "No password provided."
        });
    }

    const user = await UserModel.findOne({
        where: {
            name
        }
    });

    if (!user) {
        return res.json({
            error: "User does not exist or credentials does not match."
        });
    }

    if (!user.password) {
        return res.json({
            error: "User is not set up for credentials."
        });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.json({
            error: "User does not exist or credentials does not match."
        });
    }

    let token = await UserTokenModel.findOne();

    if (!token) {
        token = await UserTokenModel.create({
            id: randomUUID(),
            secretKey: randomBytes(32).toString("hex")
        });
    }

    const accessToken = jsonWebToken.sign(
        { userId: user.id },
        token.secretKey,
        { expiresIn: "1 Year" }
    );

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
        accessToken: accessToken,
        name: user.name,
        email: user.email,
        lastLoggin: user.lastLogin,
        credits: user.credits,
        diamonds: user.diamonds,
        duckets: user.duckets,
        motto: user.motto,
        figureConfiguration: user.figureConfiguration,

        preferences: {
            allowFriendsFollow: userPreferences.allowFriendsFollow,
            allowFriendsRequest: userPreferences.allowFriendsRequest
        }
    });
});

export default router;