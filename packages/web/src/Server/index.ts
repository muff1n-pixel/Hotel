import express from 'express';
import { QueryTypes, Sequelize } from 'sequelize';
import { readFileSync } from 'fs';
import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import path from 'path';
import cookieParser from "cookie-parser";
import { randomBytes, randomUUID } from 'crypto';
import { initializeUserModel, UserModel } from './Models/UserModel.ts';
import { initializeUserTokenModel, UserTokenModel } from './Models/UserTokens/UserTokenModel.ts';
import type { Config } from './Interfaces/Config.ts';

const config: Config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" }));

const sequelize = new Sequelize(config.database);

initializeUserModel(sequelize);
initializeUserTokenModel(sequelize);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(async (request, response, next) => {
    if (request.path === "/game/") {
        const accessToken = request.cookies.accessToken;

        if (!accessToken) {
            return response.redirect("/");
        }

        let token = await UserTokenModel.findOne();

        if (!token) {
            token = await UserTokenModel.create({
                id: randomUUID(),
                secretKey: randomBytes(32).toString("hex")
            });
        }

        try {
            if (!jsonWebToken.verify(accessToken, token.secretKey)) {
                return response.clearCookie("accessToken").redirect("/");
            }
        }
        catch (e) {
            return response.clearCookie("accessToken").redirect("/");
        }
    }

    next();
});

app.use(express.static(path.join(config.static, "web")));

app.use("/game", express.static(path.join(config.static, "game")));
app.use("/game/assets", express.static(config.assets));
app.use("/assets", express.static(config.assets));

app.get('/game/config.json', (request, response) => {
    return response.json(config.public);
});

app.get('/discord', (request, response) => {
    if (config.public.discord) {
        return response.redirect(config.public.discord);
    }

    return response.redirect("/404");
});

app.get('/{*any}', (req, res) => res.sendFile("index.html", {
    root: path.join(config.static, "web")
}));

app.post('/api/loginAuth', async (request, response) => {
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
        return response.redirect("/logout");
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return response.json({
            error: "Invalid token"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return response.json({
                error: "Invalid token"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return response.json({
                error: "Invalid token"
            });

        return response.json({
            id: user.id,
            name: user.name,
            credits: user.credits,
            diamonds: user.diamonds,
            duckets: user.duckets,
            motto: user.motto
        });
    }
    catch (e) {
        return response.json({
            error: "Invalid token"
        });
    }
});

app.post('/api/login', async (request, response) => {
    const name = request.body.name;

    if (!name) {
        return response.json({
            error: "No user name provided."
        });
    }

    const password = request.body.password;

    if (!password) {
        return response.json({
            error: "No password provided."
        });
    }

    const user = await UserModel.findOne({
        where: {
            name
        }
    });

    if (!user) {
        return response.json({
            error: "User does not exist or credentials does not match."
        });
    }

    if (!user.password) {
        return response.json({
            error: "User is not set up for credentials."
        });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return response.json({
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

    return response.json({
        id: user.id,
        name: user.name,
        credits: user.credits,
        diamonds: user.diamonds,
        duckets: user.duckets,
        motto: user.motto,
        accessToken: accessToken
    });
});

app.post('/api/register', async (request, response) => {
    const name = request.body.name;

    if (!name) {
        return response.json({
            error: "No user name provided."
        });
    }

    const plainTextPassword = request.body.password;

    if (!plainTextPassword) {
        return response.json({
            error: "No password provided."
        });
    }

    const existingUser = await UserModel.count({
        where: {
            name
        }
    });

    if (existingUser) {
        return response.json({
            error: "User name is already in use."
        });
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    const user = await UserModel.create({
        id: randomUUID(),
        name,
        password,
        homeRoomId: config.users.defaultHomeRoomId,
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

    return response.json({
        id: user.id,
        name: user.name,
        credits: user.credits,
        diamonds: user.diamonds,
        duckets: user.duckets,
        motto: user.motto,
        accessToken: accessToken
    });
});

app.listen(config.port);

console.log('Server listening on port ' + config.port);