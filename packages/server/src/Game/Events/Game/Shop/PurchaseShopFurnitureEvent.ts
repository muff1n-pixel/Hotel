import User from "../../../Users/User.js";
import { ShopPageFurnitureModel } from "../../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../../Database/Models/Furniture/FurnitureModel.js";
import { UserFurnitureModel } from "../../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { FurnitureData, HotelAlertData, PurchaseShopFurnitureData, ServerUserPlaceFurnitureInRoomData, ShopPurchaseData, UserFurnitureColorTag, UserFurnitureCustomData, UserFurnitureData, WidgetNotificationData } from "@pixel63/events";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { GroupModel } from "../../../../Database/Models/Groups/RoomGroupModel.js";
import { UserGroupModel } from "../../../../Database/Models/Users/Groups/UserGroupModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { game } from "../../../index.js";

export default class PurchaseShopFurnitureEvent implements UserProtobuffListener<PurchaseShopFurnitureData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: PurchaseShopFurnitureData) {
        const shopFurniture = await ShopPageFurnitureModel.findOne({
            where: {
                id: payload.id
            },
            include: {
                model: FurnitureModel,
                as: "furniture"
            }
        });

        let quantity = Math.min(Math.max(payload.quantity ?? 1, 1), 100);

        if(payload.position || payload.gift) {
            quantity = 1;
        }

        if(!shopFurniture) {
            user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.credits && user.model.credits < (shopFurniture.credits * quantity))) {
            user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.duckets && user.model.duckets < (shopFurniture.duckets * quantity))) {
            user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
                success: false
            }));

            return;
        }

        if((shopFurniture.diamonds && user.model.diamonds < (shopFurniture.diamonds * quantity))) {
            user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
                success: false
            }));

            return;
        }

        let group: GroupModel | undefined = undefined;

        if(shopFurniture.membership) {
            if(shopFurniture.membership === "habbogroup") {
                const userGroup = await UserGroupModel.findOne({
                    where: {
                        userId: user.model.id,
                        groupId: payload.groupId
                    },
                    include: {
                        model: GroupModel,
                        as: "group"
                    }
                });

                if(!userGroup) {
                    user.sendProtobuff(HotelAlertData, HotelAlertData.create({
                        message: "You must be a Habbo Group member to buy this furniture!"
                    }));

                    return;
                }

                group = userGroup.group;
            }
            else if(!user.hasMembership(shopFurniture.membership)) {
                user.sendProtobuff(HotelAlertData, HotelAlertData.create({
                    message: "You must be a Habbo Club member to buy this furniture!"
                }));

                return;
            }
        }

        let userReceiver = user.model;
        let giftId: string | undefined = undefined;

        if(payload.gift) {
            const giftRecipient = await UserModel.findOne({
                where: {
                    name: payload.gift.name
                }
            });

            if(!giftRecipient) {
                user.sendProtobuff(HotelAlertData, HotelAlertData.create({
                    message: "There is no user with that name!"
                }));

                return;
            }

            const giftFurniture = await FurnitureModel.findByPk(payload.gift.furnitureId);

            if(!giftFurniture) {
                throw new Error("Gift furniture does not exist.");
            }

            if(giftFurniture.interactionType !== "gift") {
                throw new Error("Gift furniture is not of gift interaction type.");
            }

            userReceiver = giftRecipient;

            const giftUserFurniture = await UserFurnitureModel.create({
                id: randomUUID(),
                position: null,
                direction: null,
                animation: 0,
                color: null,
                data: UserFurnitureCustomData.create({
                    gift: {
                        senderUserId: user.model.id,
                        message: payload.gift.message
                    }
                }),
                
                roomId: null,
                userId: userReceiver.id,
                furnitureId: giftFurniture.id
            }, {
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            });

            giftUserFurniture.user = userReceiver;
            giftUserFurniture.furniture = giftFurniture;

            await this.addUserFurniture(userReceiver, giftUserFurniture);

            giftId = giftUserFurniture.id;

            user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                id: randomUUID(),
                furniture: FurnitureData.fromJSON(giftFurniture),
                text: `You have sent a gift to ${userReceiver.name}!`
            }));

            game.getUserById(userReceiver.id)?.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
                id: randomUUID(),
                furniture: FurnitureData.fromJSON(giftFurniture),
                text: `You have received a gift from ${user.model.name}!`
            }));
        }

        user.model.credits -= (shopFurniture.credits ?? 0) * quantity;
        user.model.duckets -= (shopFurniture.duckets ?? 0) * quantity;
        user.model.diamonds -= (shopFurniture.diamonds ?? 0) * quantity;

        user.habboClub.addCashback((shopFurniture.credits ?? 0) * quantity);

        user.sendUserData();

        await user.save();

        for(let index = 0; index < quantity; index++) {
            const userFurniture = await UserFurnitureModel.create({
                id: randomUUID(),
                position: null,
                direction: null,
                animation: 0,
                color: null,
                data: null,
                giftId,

                ...(group && {
                    groupId: group.id,
                    
                    colorTags: [
                        UserFurnitureColorTag.create({
                            tag: "COLOR1",
                            color: group.primaryColor
                        }),
                        UserFurnitureColorTag.create({
                            tag: "COLOR2",
                            color: group.secondaryColor
                        })
                    ]
                }),
                
                roomId: null,
                userId: userReceiver.id,
                furnitureId: shopFurniture.furniture.id
            }, {
                include: [
                    {
                        model: FurnitureModel,
                        as: "furniture"
                    }
                ]
            });

            userFurniture.user = userReceiver;
            userFurniture.furniture = shopFurniture.furniture;

            if(userFurniture.furniture.interactionType === "trophy" && payload.data?.trophy) {
                userFurniture.data = UserFurnitureCustomData.create({
                    trophy: {
                        engraving: payload.data.trophy.engraving ?? "",
                        date: new Date().toISOString().split('T')[0]!.toString(),
                        author: user.model.name
                    }
                });

                await userFurniture.save();
            }

            if(userFurniture.furniture.interactionType === "teleport" || userFurniture.furniture.interactionType === "teleporttile") {
                const secondUserFurniture = await UserFurnitureModel.create({
                    id: randomUUID(),
                    position: null,
                    direction: null,
                    animation: 0,
                    data: UserFurnitureCustomData.create({
                        teleport: {
                            furnitureId: userFurniture.id
                        }
                    }),
                    giftId,
                    
                    roomId: null,
                    userId: userReceiver.id,
                    furnitureId: shopFurniture.furniture.id
                }, {
                    include: [
                        {
                            model: FurnitureModel,
                            as: "furniture"
                        }
                    ]
                });

                secondUserFurniture.user = userReceiver;
                secondUserFurniture.furniture = shopFurniture.furniture;

                await userFurniture.update({
                    data: UserFurnitureCustomData.create({
                        teleport: {
                            furnitureId: secondUserFurniture.id
                        }
                    })
                });

                await this.addUserFurniture(userReceiver, secondUserFurniture);
            }

            await userFurniture.save();

            if(user.room && payload.position && payload.direction !== undefined && !payload.gift) {
                user.room.client.sendProtobuff(ServerUserPlaceFurnitureInRoomData, ServerUserPlaceFurnitureInRoomData.create({
                    userId: user.model.id,
                    userFurnitureId: userFurniture.id,

                    position: payload.position,
                    direction: payload.direction
                }));
            }
            else {
                await this.addUserFurniture(userReceiver, userFurniture);
            }

            if(user.model.id === userReceiver.id && userFurniture.furniture.interactionType === "sound_set") {
                user.achievements.addAchievementScore("MusicCollector", 1).catch(console.error);
            }
        }

        user.sendProtobuff(ShopPurchaseData, ShopPurchaseData.create({
            success: true,
            itemId: payload.id,
            quantity
        }));
    }

    private async addUserFurniture(userModel: UserModel, userFurniture: UserFurnitureModel) {
        const user = game.getUserById(userModel.id);

        if(user) {
            await user.getInventory().addFurniture(userFurniture);
        }
    }
}