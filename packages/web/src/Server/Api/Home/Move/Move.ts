import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import { WebHomeUserItemModel } from "../../../Models/Web/Home/UserItem/WebHomeUserItemModel";
import { WebHomeItemModel } from "../../../Models/Web/Home/Item/WebHomeItemModel";
import { Op } from 'sequelize';
import { WebHomeShopPageItemModel } from "../../../Models/Web/Home/Shop/Item/WebHomeShopPageItem";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        homeType = req.body.homeType,
        itemId = req.body.itemId,
        positionX = req.body.positionX,
        positionY = req.body.positionY;

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

        if (
            !homeType ||
            !itemId ||
            positionX === undefined ||
            positionY === undefined ||
            positionX === null ||
            positionY === null ||
            typeof homeType !== "string" ||
            typeof itemId !== "string" ||
            typeof positionX !== "number" ||
            typeof positionY !== "number" ||
            homeType !== "user" && homeType !== "group"
        ) {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        const userItem = await WebHomeUserItemModel.findOne({
            where: {
                id: itemId,
                userId: user.id
            },
            include: [
                {
                    model: WebHomeItemModel,
                    as: "item"
                }
            ]
        });

        if (!userItem || userItem.item.type === "backgrounds")
            return res.json({
                error: "Invalid item"
            });

        const itemWidth = userItem.item.width;
        const itemHeight = userItem.item.height;

        const isValidPosition =
            positionX >= 0 &&
            positionY >= 0 &&
            positionX <= (928 - itemWidth) &&
            positionY <= (1360 - itemHeight);

        if (!isValidPosition) {
            return res.json({
                error: "Position out of bounds."
            });
        }

        userItem.update({
            positionX,
            positionY
        })

        res.json({
            success: 'Item moved.'
        })
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;