import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../../Models/Users/UserModel";
import { WhereOptions } from "sequelize";
import { WebHomeShopPageItemModel } from "../../../../Models/Web/Home/Shop/Item/WebHomeShopPageItem";
import { WebHomeItemModel } from "../../../../Models/Web/Home/Item/WebHomeItemModel";
import { WebHomeUserItemModel } from "../../../../Models/Web/Home/UserItem/WebHomeUserItemModel";
import { randomUUID } from 'crypto';
import { WebHomeShopPageModel } from "../../../../Models/Web/Home/Shop/Page/WebHomeShopPageModel";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        homeType = req.body.homeType,
        itemId = req.body.itemId;

    let amount = req.body.amount;

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

        if (!homeType || !itemId || typeof homeType !== "string" || typeof itemId !== "string" || homeType !== "user" && homeType !== "group") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        if (!amount || isNaN(parseInt(amount)) || parseInt(amount) > 50 || parseInt(amount) < 1)
            amount = 1;
        else
            amount = parseInt(amount);

        const where: WhereOptions = {
            id: itemId,
            visible: true
        };

        if (homeType === "user") {
            where.activeForUsers = 1;
        } else {
            where.activeForGroups = 1;
        }


        const item = await WebHomeShopPageItemModel.findOne({
            where,
            include: [
                {
                    model: WebHomeItemModel,
                    as: "item"
                }
            ]
        });

        if (!item)
            return res.json({
                error: "Invalid item."
            });

        const shopPage = await WebHomeShopPageModel.findOne({
            where: {
                id: item.shopPageId
            }
        })

        if(!shopPage || !shopPage.visible)
            return res.json({
                error: "Invalid item."
            });

        if (
            (amount * item.credits) > user.credits ||
            (amount * item.duckets) > user.duckets ||
            (amount * item.diamonds) > user.diamonds
        )
            return res.json({
                error: "You don't have enough money to buy this item."
            });

        await user.update({
            credits: user.credits - (amount * item.credits),
            duckets: user.duckets - (amount * item.duckets),
            diamonds: user.diamonds - (amount * item.diamonds),
        })

        for (let i = 0; i < amount; i++) {
            const newItem = await WebHomeUserItemModel.create({
                id: randomUUID(),
                itemId: item.item.id,
                userId: user.id
            })
        }

        return res.json({
            success: {
                amount,
                newBalance: {
                    credits: user.credits,
                    duckets: user.duckets,
                    diamonds: user.diamonds
                }
            }
        });
    }
    catch (e) {
        console.log(e);

        return res.json({
            error: "An error occured"
        });
    }
});

export default router;