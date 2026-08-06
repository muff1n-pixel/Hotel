import { RoomFurnitureData, UpdateRoomFurnitureTraxPlaylistData, UserFurnitureTraxData } from "@pixel63/events";
import { RoomProtobuffListener } from "../../../Interfaces/RoomProtobuffListener";
import User from "../../../../Users/User";

export default class UpdateRoomFurnitureTraxPlaylistEvent implements RoomProtobuffListener<UpdateRoomFurnitureTraxPlaylistData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: User, payload: UpdateRoomFurnitureTraxPlaylistData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have rights.");
        }

        const furniture = user.roomUser.room.furnitures.find((furniture) => furniture.model.id === payload.roomFurnitureId);

        if(!furniture) {
            throw new Error("Furniture does not exist in room.");
        }
        
        const data = furniture.getData();

        if(!data.trax) {
            data.trax = UserFurnitureTraxData.create({
                songs: [],
                playlist: []
            });
        }

        if(!payload.playlist) {
            throw new Error("Payload does not contain playlist.");
        }

        const filteredPlaylist = payload.playlist.filter((playlist) => data.trax?.songs.some((song) => song.id === playlist));

        data.trax.playlist = filteredPlaylist;

        await furniture.model.update({
            data,
            animation: (data.trax.playlist.length)?(furniture.model.animation):(0)
        });

        user.roomUser.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    userId: user.model.id,
                    furniture: furniture.model
                }
            ]
        }));
    }
}
