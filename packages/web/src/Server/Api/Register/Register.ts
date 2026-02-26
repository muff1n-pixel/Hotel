import { Router } from "express";
import { UserModel } from "../../Models/Users/UserModel";
import Server from "../..";
import { Config } from "../../Interfaces/Config";
import { UserTokenModel } from "../../Models/Users/UserTokens/UserTokenModel";
import { UserPreferenceModel } from "../../Models/Users/Preferences/UserPreferences";
import { randomBytes, randomUUID } from 'crypto';
import jsonWebToken from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

router.post("/", async (req, res) => {
    const name = req.body.name,
        email = req.body.email;

    if (!name) {
        return res.json({
            error: "No user name provided."
        });
    }

    if (name.length < 3 || name.length > 32) {
        return res.json({
            error: "Please provide a username between 3 and 32 characters."
        });
    }

    if (!name.match(/^[a-zA-Z0-9_]*$/)) {
        return res.json({
            error: "Only letters, numbers and underscore are allowed for your username."
        });
    }

    if (!name.match(/[a-zA-Z0-9]/g)) {
        return res.json({
            error: "Your username need include at least one letter or one number."
        });
    }

    const plainTextPassword = req.body.password,
        confirmPassword = req.body.confirmPassword;

    if (!plainTextPassword) {
        return res.json({
            error: "No password provided."
        });
    }

    if (plainTextPassword !== confirmPassword) {
        return res.json({
            error: "Your password confirmation not match."
        });
    }

    const existingUser = await UserModel.count({
        where: {
            name
        }
    });

    if (existingUser) {
        return res.json({
            error: "User name is already in use."
        });
    }

    if (email?.length) {
        if (email.length > 254 || !email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return res.json({
                error: "Mail provided is invalid."
            });
        }

        const existingMail = await UserModel.count({
            where: {
                email
            }
        });

        if (existingMail) {
            return res.json({
                error: "Mail provided is already in use."
            });
        }
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        const user = await UserModel.create({
            id: randomUUID(),
            name,
            email: (email?.length) ? (email) : (null),
            password,
            homeRoomId: (Server.config as Config).users.defaultHomeRoomId,
            figureConfiguration: {
                gender: "male",
                parts: [{ "type": "hd", "setId": "180", "colors": [2] }, { "type": "hr", "setId": "828", "colors": [31] }, { "type": "ea", "setId": "3196", "colors": [62] }, { "type": "ch", "setId": "255", "colors": [1415] }, { "type": "lg", "setId": "3216", "colors": [110] }, { "type": "sh", "setId": "305", "colors": [62] }],
            }
        });

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

        const userPreferences = await UserPreferenceModel.create({
            id: randomUUID(),
            userId: user.id
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

            preferences: {
                allowFriendsFollow: userPreferences.allowFriendsFollow,
                allowFriendsRequest: userPreferences.allowFriendsRequest
            }
        });
    }
    catch (e) {
        console.log("Error while register:" + e);

        return res.json({
            error: "An error occured."
        });
    }
});

export default router;