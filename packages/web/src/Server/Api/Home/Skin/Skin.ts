import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import { WebHomeUserItemModel } from "../../../Models/Web/Home/UserItem/WebHomeUserItemModel";
import { WebHomeItemModel } from "../../../Models/Web/Home/Item/WebHomeItemModel";
import { Op } from 'sequelize';

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        homeType = req.body.homeType,
        itemId = req.body.itemId,
        borderSkin = req.body.borderSkin;

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

        const availableSkins = ['none', 'default', 'golden', 'metal', 'notepad', 'speech_bubble', 'stickie_note', 'hc_bling', 'hc_scifi'];

        if (
            !homeType || 
            !itemId || 
            !borderSkin ||
            typeof homeType !== "string" || 
            typeof itemId !== "string" || 
            typeof borderSkin !== "string" ||
            !availableSkins.includes(borderSkin) ||
            homeType !== "user" && homeType !== "group"
        ) {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        const userItem = await WebHomeUserItemModel.findOne({
            include: [{ model: WebHomeItemModel, as: "item" }],
            where: {
                id: itemId,
                positionX: {
                    [Op.not]: null,
                },
                positionY: {
                    [Op.not]: null,
                },
                userId: user.id,
                '$item.type$': ['notes', 'widgets']
            }
        });

        if (!userItem)
            return res.json({
                error: "Invalid item"
            });

        userItem.update({
            borderSkin
        })

        res.json({
            success: 'Skin updated.'
        })
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;