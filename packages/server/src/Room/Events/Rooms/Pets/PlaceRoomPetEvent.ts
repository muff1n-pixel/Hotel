import { PlaceRoomPetData, ServerUserInventoryUpdatedData } from "@pixel63/events";
import RoomPet from "../../../Rooms/Pets/RoomPet.js";
import { RoomProtobuffListener } from "../../Interfaces/RoomProtobuffListener.js";
import RoomWebSocketUser from "../../../Server/Users/RoomWebSocketUser.js";
import { UserPetModel } from "../../../../Database/Models/Users/Pets/UserPetModel.js";
import { UserModel } from "../../../../Database/Models/Users/UserModel.js";
import { PetModel } from "../../../../Database/Models/Pets/PetModel.js";
import { PetBreedModel } from "../../../../Database/Models/Pets/PetBreedModel.js";
import { roomServer } from "../../../index.js";

export default class PlaceRoomPetEvent implements RoomProtobuffListener<PlaceRoomPetData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: RoomWebSocketUser, payload: PlaceRoomPetData) {
        if(!user.roomUser.hasRights() || !user.roomUser.room.model.allowPets) {
            throw new Error("User is not allowed to place pets.");
        }

        const userPet = await UserPetModel.findOne({
            where: {
                id: payload.id,
                userId: user.id,
                roomId: null
            },
            include: [
                {
                    model: UserModel,
                    as: "user"
                },
                {
                    model: PetModel,
                    as: "pet",

                    include: [
                        {
                            model: PetBreedModel,
                            as: "breed"
                        }
                    ]
                }
            ]
        });

        if(!userPet) {
            throw new Error("User does not have a user pet by this id.");
        }

        if(!payload.position) {
            throw new Error();
        }
        
        roomServer.websocket.sendServerProtobuff(ServerUserInventoryUpdatedData, ServerUserInventoryUpdatedData.create({
            userId: user.id,
            botsRemoved: [ userPet.id ]
        }));

        await RoomPet.place(user.roomUser.room, userPet, payload.position, payload.direction);
    }
}
