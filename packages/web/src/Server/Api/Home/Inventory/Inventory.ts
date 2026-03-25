import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { WebHomeUserItemModel } from "../../../Models/Web/Home/UserItem/WebHomeUserItemModel";
import { UserTokenModel } from "../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../Models/Users/UserModel";
import { WebHomeItemModel } from "../../../Models/Web/Home/Item/WebHomeItemModel";
import { WebHomeShopPageModel } from "../../../Models/Web/Home/Shop/Page/WebHomeShopPageModel";
import { WebHomeShopPageItemModel } from "../../../Models/Web/Home/Shop/Item/WebHomeShopPageItem";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken;

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


        const inventory: Array<any> = [];

        const myItems = await WebHomeUserItemModel.findAll({
            where: {
                userId: user.id,
                positionX: null,
                positionY: null
            },
            include: [
                {
                    model: WebHomeItemModel,
                    as: "item"
                }
            ]
        });


        for await (const myItem of myItems) {
            let pageId: string | null = null;

            if (myItem.item.type === "widgets")
                pageId = 'widgets';
            else {
                const pageItem = await WebHomeShopPageItemModel.findOne({
                    where: {
                        itemId: myItem.item.id
                    }
                })

                pageId = pageItem ? pageItem.shopPageId : null;
            }

            inventory.push({
                id: myItem.id,
                itemTitle: myItem.item.title,
                itemDescription: myItem.item.description,
                itemType: myItem.item.type,
                itemImage: myItem.item.image,
                itemPage: pageId,
                itemId: myItem.item.id
            })
        }

        return res.json(inventory);
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;