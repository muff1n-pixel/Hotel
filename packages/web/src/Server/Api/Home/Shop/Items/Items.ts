import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { UserTokenModel } from "../../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../../Models/Users/UserModel";
import { WhereOptions } from "sequelize";
import { WebHomeShopPageItemModel } from "../../../../Models/Web/Home/Shop/Item/WebHomeShopPageItem";
import { WebHomeItemModel } from "../../../../Models/Web/Home/Item/WebHomeItemModel";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        homeType = req.body.homeType,
        pageId = req.body.pageId;

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

        if (typeof homeType !== "string" || typeof pageId !== "string" || homeType !== "user" && homeType !== "group") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        const where: WhereOptions = {
            shopPageId: pageId,
            visible: true
        };

        if (homeType === "user") {
            where.activeForUsers = 1;
        } else {
            where.activeForGroups = 1;
        }

        const items: Array<any> = [];

        const shopItems = await WebHomeShopPageItemModel.findAll({
            where,
            include: [
                {
                    model: WebHomeItemModel,
                    as: "item"
                }
            ]
        })

        shopItems.forEach((shopItem) => {
            items.push({
                id: shopItem.id,
                itemTitle: shopItem.item.title,
                itemDescription: shopItem.item.description,
                itemType: shopItem.item.type,
                itemImage: shopItem.item.image,
                itemCredits: shopItem.credits,
                itemDuckets: shopItem.duckets,
                itemDiamonds: shopItem.diamonds
            })
        })

        return res.json(items);
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;