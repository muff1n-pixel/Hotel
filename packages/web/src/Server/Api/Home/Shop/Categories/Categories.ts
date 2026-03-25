import { Router } from "express";
import jsonWebToken from "jsonwebtoken";
import { randomUUID } from 'crypto';
import { UserTokenModel } from "../../../../Models/Users/UserTokens/UserTokenModel";
import { UserModel } from "../../../../Models/Users/UserModel";
import { WebHomeShopPageModel } from "../../../../Models/Web/Home/Shop/Page/WebHomeShopPageModel";
import { WhereOptions } from "sequelize";

const router = Router();

router.post("/", async (req, res) => {
    const accessToken = req.cookies.accessToken,
        homeType = req.body.homeType;

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

        if (typeof homeType !== "string" || homeType !== "user" && homeType !== "group") {
            return res.json({
                error: "The data sent is invalid."
            });
        }

        const shopPages: Array<any> = [];

        const where: WhereOptions = {
            parentId: null
        };

        if (homeType === "user") {
            where.activeForUsers = 1;
        } else {
            where.activeForGroups = 1;
        }

        const shopPagesData = await WebHomeShopPageModel.findAll({
            where
        });

        for await (const shopPageData of shopPagesData) {
            where.parentId = shopPageData.id;

            const subPagesData = await WebHomeShopPageModel.findAll({
                where
            });

            shopPages.push({
                id: shopPageData.id,
                title: shopPageData.title,
                description: shopPageData.description,
                visible: shopPageData.visible,

                subs: subPagesData.length > 0
                    ? subPagesData
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map(sub => ({
                            id: sub.id,
                            title: sub.title,
                            description: sub.description,
                        }))
                    : null
            });
        }

        return res.json(shopPages.sort((a, b) => {
            const aHasSubs = a.subs && a.subs.length > 0;
            const bHasSubs = b.subs && b.subs.length > 0;

            return bHasSubs - aHasSubs;
        }));
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;