import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { Op } from 'sequelize';
import { UserTokenModel } from "../../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../../Models/Users/UserModel";
import { WebHomeGuestBookMessage } from "../../../../Models/Web/Home/Guestbook/WebHomeGuestBookMessage";
import { randomUUID } from 'crypto';
import { WebHomeUserItemModel } from "../../../../Models/Web/Home/UserItem/WebHomeUserItemModel";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        message = req.body.message,
        homeId = req.body.homeId;

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

        if (!message)
            return res.json({
                error: "Please enter a message."
            });

        if (!homeId ||
            typeof message !== "string" ||
            typeof homeId !== "string") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        if (message.trim().length < 5)
            return res.json({
                error: "Your message must be at least 5 characters long."
            });

        if (message.trim().length > 200)
            return res.json({
                error: "Your message cannot exceed 200 characters."
            });

        const lastComment = await WebHomeGuestBookMessage.findOne({
            where: {
                userId: user.id
            },
            order: [['createdAt', 'DESC']],
        });

        if (lastComment) {
            const diff = Date.now() - new Date(lastComment.createdAt).getTime();

            if (diff < 120000) {
                const remaining = Math.ceil((120000 - diff) / 1000);

                return res.json({
                    error: `You must wait ${remaining} seconds before posting another message.`
                });
            }
        }

        const userItem = await WebHomeUserItemModel.findOne({
            where: {
                itemId: 'widgets_guestbook',
                positionX: {
                    [Op.not]: null,
                },
                positionY: {
                    [Op.not]: null,
                },
                userId: homeId
            }
        });

        if (!userItem)
            return res.json({
                error: "User doesnt exist or doesnt have guestbook widget active."
            });


        const newMessage = await WebHomeGuestBookMessage.create({
            id: randomUUID(),
            message: message.trim(),
            homeId: homeId,
            userId: user.id
        })


        res.json({
            id: newMessage.id,
            message: newMessage.message,
            date: newMessage.createdAt,
            user: {
                id: user.id,
                name: user.name,
                motto: user.motto,
                figureConfiguration: user.figureConfiguration,
                online: user.online
            }
        })
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;