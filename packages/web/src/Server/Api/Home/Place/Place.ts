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
        itemId = req.body.itemId;

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

        const userItem = await WebHomeUserItemModel.findOne({
            where: {
                id: itemId,
                positionX: null,
                positionY: null,
                userId: user.id
            },
            include: [
                {
                    model: WebHomeItemModel,
                    as: "item"
                }
            ]
        });

        if (!userItem)
            return res.json({
                error: "Invalid item"
            });

        let placedItem: Array<any> = [];
        let removedItem: Array<any> = [];

        switch (userItem.item.type) {
            case 'backgrounds': {
                const userBackground = await WebHomeUserItemModel.findOne({
                    include: [{ model: WebHomeItemModel, as: "item" }],
                    where: {
                        userId: user.id,
                        positionX: {
                            [Op.not]: null,
                        },
                        positionY: {
                            [Op.not]: null,
                        },
                        '$item.type$': 'backgrounds'
                    }
                });

                if (userBackground) {
                    const userBackgroundPage = await WebHomeShopPageItemModel.findOne({
                        where: {
                            itemId: userBackground.item.id
                        }
                    })

                    userBackground.update({
                        positionX: null,
                        positionY: null
                    })

                    removedItem.push({
                        id: userBackground.id,
                        positionX: userBackground.positionX,
                        positionY: userBackground.positionY,
                        itemId: userBackground.item.id,
                        itemDescription: userBackground.item.description,
                        itemType: userBackground.item.type,
                        itemImage: userBackground.item.image,
                        itemPage: userBackgroundPage ? userBackgroundPage.shopPageId : null,
                    })
                }

                userItem.update({
                    positionX: 0,
                    positionY: 0
                })

                placedItem.push({
                    id: userItem.id,
                    positionX: userItem.positionX,
                    positionY: userItem.positionY,
                    itemId: userItem.item.id,
                    itemDescription: userItem.item.description,
                    itemType: userItem.item.type,
                    itemImage: userItem.item.image,
                })
                break;
            }

            case 'widgets': {
                userItem.update({
                    positionX: Math.random() * 200,
                    positionY: Math.random() * 300,
                    borderSkin: 'default'
                })

                placedItem.push({
                    id: userItem.id,
                    positionX: userItem.positionX,
                    positionY: userItem.positionY,
                    borderSkin: userItem.borderSkin,
                    itemId: userItem.item.id,
                    itemDescription: userItem.item.description,
                    itemType: userItem.item.type,
                    itemImage: userItem.item.image,
                    itemWidth: userItem.item.width,
                    itemHeight: userItem.item.height
                })
                break;
            }

            case 'stickers': {
                const userStickers = await WebHomeUserItemModel.count({
                    include: [{ model: WebHomeItemModel, as: "item" }],
                    where: {
                        userId: user.id,
                        positionX: {
                            [Op.not]: null,
                        },
                        positionY: {
                            [Op.not]: null,
                        },
                        '$item.type$': 'stickers'
                    }
                })

                if (userStickers > 100)
                    return res.json({
                        error: "You can't place more than 100 stickers on your page."
                    });

                userItem.update({
                    positionX: Math.random() * (928 - userItem.item.width),
                    positionY: Math.random() * ((userItem.item.height < 500 ? 500 : 1360) - userItem.item.height),
                })

                placedItem.push({
                    id: userItem.id,
                    positionX: userItem.positionX,
                    positionY: userItem.positionY,
                    itemId: userItem.item.id,
                    itemDescription: userItem.item.description,
                    itemType: userItem.item.type,
                    itemImage: userItem.item.image,
                    itemWidth: userItem.item.width,
                    itemHeight: userItem.item.height
                })
                break;
            }

            case "notes": {
                let noteData = req.body.noteData;

                if(
                    !noteData ||
                    typeof homeType !== "string"
                )
                    return res.json({
                        error: "Please enter a note."
                    });

                noteData = noteData.trim();

                if(noteData.length > 500)
                    return res.json({
                        error: "Your note can't exceed 500 characters."
                    });

                const usersNotes = await WebHomeUserItemModel.count({
                    include: [{ model: WebHomeItemModel, as: "item" }],
                    where: {
                        userId: user.id,
                        positionX: {
                            [Op.not]: null,
                        },
                        positionY: {
                            [Op.not]: null,
                        },
                        '$item.type$': 'notes'
                    }
                })

                if (usersNotes > 10)
                    return res.json({
                        error: "You can't place more than 10 notes on your page."
                    });

                userItem.update({
                    positionX: Math.random() * 200,
                    positionY: Math.random() * 300,
                    data: noteData,
                    borderSkin: 'default'
                })

                placedItem.push({
                    id: userItem.id,
                    positionX: userItem.positionX,
                    positionY: userItem.positionY,
                    data: userItem.data,
                    borderSkin: userItem.borderSkin,
                    itemId: userItem.item.id,
                    itemDescription: userItem.item.description,
                    itemType: userItem.item.type,
                    itemImage: userItem.item.image,
                    itemWidth: userItem.item.width,
                    itemHeight: userItem.item.height
                })
                break;
            }
        }

        res.json({
            placedItem: placedItem,
            removedItem: removedItem
        })
    }
    catch (e) {
        return res.json({
            error: "An error occured"
        });
    }
});

export default router;