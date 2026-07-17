import User from "../../../Users/User.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { ShopPageFurnitureModel } from "../../../Database/Models/Shop/ShopPageFurnitureModel.js";
import { FurnitureModel } from "../../../Database/Models/Furniture/FurnitureModel.js";
import RoomFurniture from "../../../Rooms/Furniture/RoomFurniture.js";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel.js";
import { randomUUID } from "node:crypto";
import { PurchaseShopFurnitureData, PurchaseShopMembershipData, ShopFurniturePurchaseData, UserFurnitureCustomData, UserFurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { ShopPageMembershipModel } from "../../../Database/Models/Shop/ShopPageMembershipModel.js";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel.js";
import { RoomGroupModel } from "../../../Database/Models/Rooms/Groups/RoomGroupModel.js";

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

                const room = await RoomModel.findByPk(payload.group.identity?.homeroomId);

                if(!room) {
                    throw new Error("Room does not exist.");
                }

                if(user.model.id !== room.ownerId) {
                    throw new Error("User does not own the room.");
                }

                if(room.groupId) {
                    throw new Error("Room is already a group homeroom.");
                }

                const groupId = randomUUID();

                await RoomGroupModel.create({
                    id: groupId,

                    name: payload.group.identity?.name,
                    description: payload.group.identity?.description,

                    primaryColor: payload.group.colors?.primaryColor,
                    secondaryColor: payload.group.colors?.secondaryColor,

                    badge: payload.group.badge
                });

                await room.update({
                    groupId
                });

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
