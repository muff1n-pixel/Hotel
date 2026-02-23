import express from 'express';
import { QueryTypes, Sequelize } from 'sequelize';
import { readFileSync } from 'fs';
import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import path from 'path';
import cookieParser from "cookie-parser";
import { randomBytes, randomUUID } from 'crypto';
import { initializeUserModel, UserModel } from './Models/Users/UserModel.ts';
import { initializeUserTokenModel, UserTokenModel } from './Models/Users/UserTokens/UserTokenModel.ts';
import type { Config } from './Interfaces/Config.ts';
import { initializeUserPreferencesModel, UserPreferenceModel } from './Models/Users/Preferences/UserPreferences.ts';
import { initializeWebArticleModel } from './Models/Web/Article/WebArticleModel.ts';
import { initializeWebArticleLikeModel } from './Models/Web/Article/Like/WebArticleLikeModel.ts';
import { initializeWebArticleCommentModel } from './Models/Web/Article/Comment/WebArticleCommentModel.ts';

const config: Config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" }));

const sequelize = new Sequelize(config.database);

initializeUserModel(sequelize);
initializeUserTokenModel(sequelize);
initializeUserPreferencesModel(sequelize);
initializeWebArticleModel(sequelize);
initializeWebArticleLikeModel(sequelize);
initializeWebArticleCommentModel(sequelize);

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

        if (user === null) {
            return response.json({
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

        return response.json({
            id: user.id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            diamonds: user.diamonds,
            duckets: user.duckets,
            motto: user.motto,

            preferences: {
                allowFriendsFollow: userPreferences?.allowFriendsFollow,
                allowFriendsRequest: userPreferences?.allowFriendsRequest,
            }
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

    const [userPreferences] = await UserPreferenceModel.findOrCreate({
        where: {
            userId: user.id
        },
        defaults: {
            id: randomUUID()
        }
    });

    return response.json({
        id: user.id,
        accessToken: accessToken,
        name: user.name,
        email: user.email,
        credits: user.credits,
        diamonds: user.diamonds,
        duckets: user.duckets,
        motto: user.motto,
        
        preferences: {
            allowFriendsFollow: userPreferences.allowFriendsFollow,
            allowFriendsRequest: userPreferences.allowFriendsRequest
        }
    });
});

app.post('/api/register', async (request, response) => {
    const name = request.body.name,
        email = request.body.email;

    if (!name) {
        return response.json({
            error: "No user name provided."
        });
    }

    if (name.length < 3 || name.length > 32) {
        return response.json({
            error: "Please provide a username between 3 and 32 characters."
        });
    }

    if (!name.match(/^[a-zA-Z0-9_]*$/)) {
        return response.json({
            error: "Only letters, numbers and underscore are allowed for your username."
        });
    }

    if (!name.match(/[a-zA-Z0-9]/g)) {
        return response.json({
            error: "Your username need include at least one letter or one number."
        });
    }

    const plainTextPassword = request.body.password,
        confirmPassword = request.body.confirmPassword;

    if (!plainTextPassword) {
        return response.json({
            error: "No password provided."
        });
    }

    if (plainTextPassword !== confirmPassword) {
        return response.json({
            error: "Your password confirmation not match."
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

    if(email?.length) {
        if (email.length > 254 || !email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return response.json({
                error: "Mail provided is invalid."
            });
        }

        const existingMail = await UserModel.count({
            where: {
                email
            }
        });

        if (existingMail) {
            return response.json({
                error: "Mail provided is already in use."
            });
        }
    }

    const password = await bcrypt.hash(plainTextPassword, 10);

    try {
        const user = await UserModel.create({
            id: randomUUID(),
            name,
            email: (email?.length)?(email):(null),
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

        const userPreferences = await UserPreferenceModel.create({
            id: randomUUID(),
            userId: user.id
        });

        return response.json({
            id: user.id,
            accessToken: accessToken,
            name: user.name,
            email: user.email,
            credits: user.credits,
            diamonds: user.diamonds,
            duckets: user.duckets,
            motto: user.motto,
            allowFriendsFollow: userPreferences.allowFriendsFollow,
            allowFriendsRequest: userPreferences.allowFriendsRequest
        })
    }
    catch (e) {
        console.log("Error while register:" + e);

        return response.json({
            error: "An error occured."
        });
    }
});

// ONLINES
app.post('/api/hotel/information', async (request, response) => {
    const usersOnline = await UserModel.count({
        where: {
            online: true
        }
    });

    return response.json({
        usersOnline
    });
});

// SETTINGS
app.post('/api/settings/mail', async (request, response) => {
    const accessToken = request.cookies.accessToken,
        email = request.body.email;

    if (!accessToken) {
        return response.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return response.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return response.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return response.json({
                error: "An error occured"
            });

        if (!email) {
            return response.json({
                error: "No mail provided."
            });
        }

        if (email.length > 254 || !email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return response.json({
                error: "Mail provided is invalid."
            });
        }

        const existingMail = await UserModel.count({
            where: {
                email
            }
        });

        if (existingMail) {
            return response.json({
                error: "Mail provided is already in use."
            });
        }

        await user.update({
            email
        });

        return response.json({
            success: "The mail address has been successfully modified."
        });

    }
    catch (e) {
        return response.json({
            error: "An error occured"
        });
    }
});

app.post('/api/settings/password', async (request, response) => {
    const accessToken = request.cookies.accessToken,
        oldPassword = request.body.oldPassword,
        password = request.body.password,
        passwordConfirm = request.body.passwordConfirm;

    if (!accessToken) {
        return response.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return response.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return response.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return response.json({
                error: "An error occured"
            });

        if (!oldPassword) {
            return response.json({
                error: "Please enter your old password."
            });
        }

        if (!password) {
            return response.json({
                error: "Please enter a new password."
            });
        }

        if (password !== passwordConfirm) {
            return response.json({
                error: "Your password confirmation not match."
            });
        }

        if (!(await bcrypt.compare(oldPassword, user.password))) {
            return response.json({
                error: "Your current password does not match."
            });
        }

        if ((await bcrypt.compare(password, user.password))) {
            return response.json({
                error: "Your new password is the same as your current one."
            });
        }

        const newPassword = await bcrypt.hash(password, 10);
        await user.update({
            password: newPassword
        })

        return response.json({
            success: "Your password has been edited."
        });

    }
    catch (e) {
        return response.json({
            error: "An error occured"
        });
    }
});

// SETTINGS
app.post('/api/settings/mail', async (request, response) => {
    const accessToken = request.cookies.accessToken,
        email = request.body.email;

    if (!accessToken) {
        return response.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return response.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return response.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return response.json({
                error: "An error occured"
            });

        if (!email) {
            return response.json({
                error: "No mail provided."
            });
        }

        if (email.length > 254 || !email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            return response.json({
                error: "Mail provided is invalid."
            });
        }

        const existingMail = await UserModel.count({
            where: {
                email
            }
        });

        if (existingMail) {
            return response.json({
                error: "Mail provided is already in use."
            });
        }

        await user.update({
            email
        });

        return response.json({
            success: "The mail address has been successfully modified."
        });

    }
    catch (e) {
        return response.json({
            error: "An error occured"
        });
    }
});

app.post('/api/randomUsersOnline', async (request, response) => {
    const usersOnline = await UserModel.findAll({
        where: {
            online: true
        },
        order: Sequelize.literal('rand()'),
        limit: 18
    });

    const usersData: Array<any> = [];
    usersOnline.forEach(user => {
        usersData.push({
            id: user.id,
            name: user.name,
            motto: user.motto
        })
    });

    return response.json(usersData);
});

app.post('/api/settings/friends', async (request, response) => {
    const accessToken = request.cookies.accessToken,
        allowFriendsRequest = request.body.allowFriendsRequest,
        allowFriendsFollow = request.body.allowFriendsFollow;

    if (!accessToken) {
        return response.json({
            error: "An error occured"
        })
    }

    let token = await UserTokenModel.findOne();
    if (token === null)
        return response.json({
            error: "An error occured"
        });

    try {
        const keyData = jsonWebToken.verify(accessToken, token.secretKey);
        if (keyData === null || (keyData as any).userId === undefined)
            return response.json({
                error: "An error occured"
            });

        const user = await UserModel.findOne({
            where: {
                id: (keyData as any).userId
            }
        });

        if (user === null)
            return response.json({
                error: "An error occured"
            });

        if (typeof allowFriendsRequest !== "boolean" || typeof allowFriendsFollow !== "boolean") {
            return response.json({
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

        return response.json({
            success: "Your friends settings has been edited."
        });

    }
    catch (e) {
        return response.json({
            error: "An error occured"
        });
    }
});

app.listen(config.port);

console.log('Server listening on port ' + config.port);