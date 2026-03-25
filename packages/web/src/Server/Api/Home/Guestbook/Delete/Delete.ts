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
        messageId = req.body.messageId;

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

        if (!messageId ||
            typeof messageId !== "string") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        const message = await WebHomeGuestBookMessage.findOne({
            where: {
                id: messageId,
                homeId: user.id
            }
        });

        if (!message)
            return res.json({
                error: "Message doesnt exist."
            });

        await message.destroy();

        res.json({
            success: 'Message deleted.'
        })
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;