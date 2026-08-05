import { FurnitureTraxSongMetaData, RoomFurnitureData, UpdateRoomFurnitureTraxSongData, UserFurnitureTraxData } from "@pixel63/events";
import { randomUUID } from "crypto";
import { RoomProtobuffListener } from "../../../Interfaces/RoomProtobuffListener";
import RoomWebSocketUser from "../../../../Server/Users/RoomWebSocketUser";

export default class UpdateRoomFurnitureTraxSongEvent implements RoomProtobuffListener<UpdateRoomFurnitureTraxSongData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: RoomWebSocketUser, payload: UpdateRoomFurnitureTraxSongData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const furniture = user.roomUser.room.furnitures.find((furniture) => furniture.model.id === payload.roomFurnitureId);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }

        if(furniture?.model.userId !== user.id) {
            throw new Error("User is not owner of Trax.");
        }
        
        const data = furniture.getData();

        if(!data.trax) {
            data.trax = UserFurnitureTraxData.create({
                songs: [],
                playlist: []
            });
        }

        if(!payload.song) {
            throw new Error("Payload does not contain a song.");
        }

        const duration = Math.max(...payload.song.slots.map((slot) => slot.column + slot.duration)) * 2;

        const existingSong = data.trax.songs.find((song) => song.id === payload.songId);

        if(!payload.songId || !existingSong) {
            data.trax.songs.push(FurnitureTraxSongMetaData.create({
                id: randomUUID(),
                name: payload.name,
                song: payload.song,
                duration
            }));
        }
        else {
            if(existingSong.userFurnitureId) {
                throw new Error("Song is bound to a furniture.");
            }
            
            existingSong.name = payload.name;
            existingSong.song = payload.song;
            existingSong.duration = duration;
        }

        await furniture.model.update({
            data
        });

        user.roomUser.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    userId: user.id,
                    furniture: furniture.model
                }
            ]
        }));
    }
}
