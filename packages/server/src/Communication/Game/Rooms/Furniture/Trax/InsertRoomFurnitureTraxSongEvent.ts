import { FurnitureTraxSongMetaData, RoomFurnitureData, InsertRoomFurnitureTraxSongData, UserFurnitureTraxData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener";
import User from "../../../../../Users/User";
import { randomUUID } from "crypto";
import { UserFurnitureModel } from "../../../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel";

export default class InsertRoomFurnitureTraxSongEvent implements ProtobuffListener<InsertRoomFurnitureTraxSongData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: User, payload: InsertRoomFurnitureTraxSongData) {
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
        
        const songFurniture = await UserFurnitureModel.findByPk(payload.songFurnitureId, {
            include: [
                {
                    model: FurnitureModel,
                    as: "furniture"
                }
            ]
        });

        if(!songFurniture) {
            throw new Error("Song furniture does not exist.");
        }

        if(songFurniture.userId !== user.model.id) {
            throw new Error("User does not own the sound disk.");
        }

        if(songFurniture.roomId || songFurniture.traxId) {
            throw new Error("Song is already used by a room or trax.");
        }
        
        const data = furniture.getData();

        if(!data.trax) {
            data.trax = UserFurnitureTraxData.create({
                songs: [],
                playlist: []
            });
        }

        if(!songFurniture.data?.traxSongDisk?.song) {
            throw new Error("Song disk does not contain a song.");
        }

        data.trax.songs.push(FurnitureTraxSongMetaData.create({
            id: randomUUID(),
            userFurnitureId: songFurniture.id,

            name: songFurniture.data?.traxSongDisk?.song.name,
            song: songFurniture.data?.traxSongDisk?.song.song,
            duration: songFurniture.data?.traxSongDisk?.song.duration
        }));

        await furniture.model.update({
            data
        });

        await songFurniture.update({
            traxId: furniture.model.id
        });

        user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    userId: user.model.id,
                    furniture: furniture.model
                }
            ]
        }));

        await user.getInventory().deleteFurniture(songFurniture);
    }
}
