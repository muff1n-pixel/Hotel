import { FurnitureTraxSongMetaData, RoomFurnitureData, BurnRoomFurnitureTraxSongData, UserFurnitureTraxData, UserFurnitureCustomData, WidgetNotificationData, FurnitureData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener";
import User from "../../../../../Users/User";
import { randomUUID } from "crypto";
import { UserFurnitureModel } from "../../../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel";

export default class BurnRoomFurnitureTraxSongEvent implements ProtobuffListener<BurnRoomFurnitureTraxSongData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: User, payload: BurnRoomFurnitureTraxSongData) {
        if(!user.room) {
            return;
        }

        const roomUser = user.room.getRoomUser(user);

        if(!roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const furniture = user.room.furnitures.find((furniture) => furniture.model.id === payload.roomFurnitureId);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        if(furniture?.model.userId !== user.model.id) {
            throw new Error("User is not owner of Trax.");
        }
        
        const data = furniture.getData();

        if(!data.trax) {
            data.trax = UserFurnitureTraxData.create({
                songs: [],
                playlist: []
            });
        }

        const existingSong = data.trax.songs.find((song) => song.id === payload.songId);

        if(!existingSong) {
            throw new Error("Song does not exist in Trax.");
        }

        if(existingSong.userFurnitureId) {
            throw new Error("Song is already burned.");
        }

        if(user.model.credits < 10) {
            throw new Error("User cannot afford burning.");
        }

        const songDiskFurniture = await FurnitureModel.findOne({
            where: {
                type: "song_disk"
            }
        });

        if(!songDiskFurniture) {
            throw new Error("Song disk furniture does not exist.");
        }

        user.model.credits -= 30;

        await user.model.save();
        
        const userFurniture = await UserFurnitureModel.create({
            id: randomUUID(),

            name: existingSong.name,
            description: `By ${user.model.name}`,

            position: null,
            direction: null,
            animation: 0,
            color: null,

            data: UserFurnitureCustomData.create({
                traxSongDisk: {
                    song: existingSong
                }
            }),
            
            roomId: null,
            userId: user.model.id,
            traxId: furniture.model.id,
            furnitureId: songDiskFurniture.id
        });

        existingSong.userFurnitureId = userFurniture.id;

        await furniture.model.update({
            data
        });

        user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    userId: user.model.id,
                    furniture: furniture.model
                }
            ]
        }));

        user.sendProtobuff(WidgetNotificationData, WidgetNotificationData.create({
            id: randomUUID(),
            furniture: FurnitureData.fromJSON(songDiskFurniture.toJSON()),
            text: `You have burnt '${existingSong.name}' to a song disk! It is now inserted in your Trax machine.`
        }));
    }
}
