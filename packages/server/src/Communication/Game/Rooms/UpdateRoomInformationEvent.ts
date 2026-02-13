import { RoomInformationEventData } from "@shared/Communications/Responses/Rooms/RoomInformationEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UpdateRoomInformationEventData } from "@shared/Communications/Requests/Rooms/UpdateRoomInformationEventData.js";
import { RoomCategoryModel } from "../../../Database/Models/Rooms/Categories/RoomCategoryModel.js";

export default class UpdateRoomInformationEvent implements IncomingEvent<UpdateRoomInformationEventData> {
    async handle(user: User, event: UpdateRoomInformationEventData) {
        if(!user.room) {
            throw new Error("User is not in a room.");
        }

        if(event.name !== undefined) {
            user.room.model.name = event.name;
        }
        
        if(event.description !== undefined) {
            user.room.model.description = event.description;
        }
        
        if(event.category !== undefined) {
            const category = await RoomCategoryModel.findOne({
                where: {
                    id: event.category
                }
            });

            if(category) {
                user.room.model.set({
                    categoryId: category.id
                });

                user.room.model.category = category;
            }
        }

        if(event.maxUsers !== undefined) {
            if(event.maxUsers >= 5 && event.maxUsers <= 50 && event.maxUsers % 5 === 0) {
                user.room.model.maxUsers = event.maxUsers;
            }
        }

        if(user.room.model.changed()) {
            await user.room.model.save();

            user.room.sendRoomEvent(new OutgoingEvent<RoomInformationEventData>("RoomInformationEvent", {
                information: {
                    name: user.room.model.name,
                    description: user.room.model.description,
                    category: user.room.model.category.id,

                    owner: {
                        id: user.room.model.owner.id,
                        name: user.room.model.owner.name,
                    },

                    maxUsers: user.room.model.maxUsers
                }
            }));
        }
    }
}
