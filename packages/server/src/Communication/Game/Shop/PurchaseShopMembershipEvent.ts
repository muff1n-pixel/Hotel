import User from "../../../Users/User.js";
import { randomUUID } from "node:crypto";
import { PurchaseShopMembershipData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPageMembershipModel } from "../../../Database/Models/Shop/ShopPageMembershipModel.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel.js";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel.js";
import { game } from "../../../index.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";

export default class PurchaseShopMembershipEvent implements ProtobuffListener<PurchaseShopMembershipData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: PurchaseShopMembershipData) {
        const shopMembership = await ShopPageMembershipModel.findOne({
            where: {
                id: payload.id
            },
        });

        if(!shopMembership) {
            return;
        }

        if((shopMembership.credits && user.model.credits < shopMembership.credits)) {
            return;
        }

        if((shopMembership.duckets && user.model.duckets < shopMembership.duckets)) {
            return;
        }

        if((shopMembership.diamonds && user.model.diamonds < shopMembership.diamonds)) {
            return;
        }

        switch(shopMembership.membership) {
            case "habboclub": {
                const date = (user.model.habboClub && new Date(user.model.habboClub) >= new Date())?(new Date(user.model.habboClub)):(new Date());

                date.setDate(date.getDate() + shopMembership.days);

                user.model.habboClub = date;

                break;
            }

            case "habbogroup": {
                if(!payload.group) {
                    throw new Error("Missing group creation data from payload.");
                }

                const roomModel = await RoomModel.findByPk(payload.group.identity?.homeroomId);

                if(!roomModel) {
                    throw new Error("Room does not exist.");
                }

                if(user.model.id !== roomModel.ownerId) {
                    throw new Error("User does not own the room.");
                }

                if(roomModel.groupId) {
                    throw new Error("Room is already a group homeroom.");
                }

                const groupId = randomUUID();

                await GroupModel.create({
                    id: groupId,

                    name: payload.group.identity?.name,
                    description: payload.group.identity?.description,

                    primaryColor: payload.group.colors?.primaryColor,
                    secondaryColor: payload.group.colors?.secondaryColor,

                    badge: payload.group.badge
                });

                await UserGroupModel.create({
                    userId: user.model.id,
                    groupId,

                    owner: true,
                    admin: true
                });

                await roomModel.update({
                    groupId
                });

                const room = game.roomManager.getRoomInstance(roomModel.id);

                if(room) {
                    await room.group.update();
                }

                break;
            }

            case "roomevent": {
                if(!payload.event) {
                    throw new Error("Missing event creation data from payload.");
                }

                const roomModel = await RoomModel.findByPk(payload.event.roomId);

                if(!roomModel) {
                    throw new Error("Room does not exist.");
                }

                if(user.model.id !== roomModel.ownerId) {
                    throw new Error("User does not own the room.");
                }

                const roomCategory = await RoomCategoryModel.findByPk(payload.event.categoryId);

                if(!roomCategory) {
                    throw new Error("Category does not exist.");
                }

                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 2);

                await roomModel.update({
                    eventName: payload.event.name,
                    eventDescription: payload.event.description,

                    eventCategoryId: roomCategory.id,
                    eventExpiresAt: expiresAt.toISOString()
                });

                const room = game.roomManager.getRoomInstance(roomModel.id);

                if(room) {
                    await room.event.update();
                }

                break;
            }
        }

        user.model.credits -= (shopMembership.credits ?? 0);
        user.model.duckets -= (shopMembership.duckets ?? 0);
        user.model.diamonds -= (shopMembership.diamonds ?? 0);

        await user.model.save();

        user.sendUserData();
    }
}
