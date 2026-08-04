import { GetGroupData, RoomFurnitureData, UpdateGroupData, UserFurnitureColorTag } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { GroupModel } from "../../../Database/Models/Groups/RoomGroupModel";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import { game } from "../../..";
import { RoomModel } from "../../../Database/Models/Rooms/RoomModel";
import GetGroupEvent from "./GetGroupEvent";
import { UserFurnitureModel } from "../../../Database/Models/Users/Furniture/UserFurnitureModel";

export default class UpdateGroupEvent implements ProtobuffListener<UpdateGroupData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: UpdateGroupData): Promise<void> {
        const group = await GroupModel.findByPk(payload.id);

        if(!group) {
            throw new Error("Group does not exist.");
        }

        const roomModel = await RoomModel.findOne({
            where: {
                groupId: group.id
            }
        });

        if(!roomModel) {
            throw new Error("Room does not exist.");
        }

        const userGroup = await UserGroupModel.findOne({
            where: {
                userId: user.model.id,
                groupId: group.id
            }
        });

        if(!userGroup) {
            throw new Error("User is not in group.");
        }

        if(!userGroup.owner) {
            throw new Error("User is not owner of group.");
        }

        if(group.primaryColor !== payload.primaryColor || group.secondaryColor !== payload.secondaryColor) {
            const [count, affectedUserFurniture] = await UserFurnitureModel.update({
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
            }, {
                where: {
                    groupId: group.id
                },
                returning: true
            });

            for(const userFurniture of affectedUserFurniture) {
                if(!userFurniture.roomId) {
                    continue;
                }

                const room = game.roomManager.getRoomInstance(userFurniture.roomId);

                if(!room) {
                    continue;
                }

                const roomFurniture = room.getRoomFurniture(userFurniture.id);

                roomFurniture.model.colorTags = [
                    UserFurnitureColorTag.create({
                        tag: "COLOR1",
                        color: group.primaryColor
                    }),
                    UserFurnitureColorTag.create({
                        tag: "COLOR2",
                        color: group.secondaryColor
                    })
                ];

                room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
                    furnitureUpdated: [
                        {
                            furniture: {
                                id: userFurniture.id,
                                colorTags: userFurniture.colorTags
                            }
                        }
                    ]
                }));
            }
        }

        await group.update({
            name: payload.name,
            description: payload.description,

            type: payload.type,
            rights: payload.rights,

            primaryColor: payload.primaryColor,
            secondaryColor: payload.secondaryColor,

            badge: payload.badge
        });

        const room = game.roomManager.getRoomInstance(roomModel.id);

        if(room) {
            await room.group.update();
        }

        await new GetGroupEvent().handle(user, GetGroupData.create({
            id: group.id
        }));
    }
}
