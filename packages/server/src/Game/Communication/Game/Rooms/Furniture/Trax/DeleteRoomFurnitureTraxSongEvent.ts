import { FurnitureTraxSongMetaData, RoomFurnitureData, DeleteRoomFurnitureTraxSongData, UserFurnitureTraxData, UserFurnitureCustomData } from "@pixel63/events";
import ProtobuffListener from "../../../../Interfaces/ProtobuffListener";
import User from "../../../../../Users/User";
import { UserFurnitureModel } from "../../../../../Database/Models/Users/Furniture/UserFurnitureModel";
import { game } from "../../../../..";
import { FurnitureModel } from "../../../../../Database/Models/Furniture/FurnitureModel";

export default class DeleteRoomFurnitureTraxSongEvent implements ProtobuffListener<DeleteRoomFurnitureTraxSongData> {
    minimumDurationBetweenEvents?: number = 500;
    
    async handle(user: User, payload: DeleteRoomFurnitureTraxSongData) {
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
            throw new Error("Furniture does not have this song.");
        }

        if(existingSong.userFurnitureId) {
            const userFurniture = await UserFurnitureModel.findByPk(existingSong.userFurnitureId, {
                include: {
                    model: FurnitureModel,
                    as: "furniture"
                }
            });

            if(userFurniture) {
                await userFurniture.update({
                    data: UserFurnitureCustomData.create({
                        traxSongDisk: {
                            song: existingSong
                        }
                    }),
                    traxId: null
                });

                if(userFurniture.userId) {
                    const user = game.getUserById(userFurniture.userId);

                    if(user) {
                        await user.getInventory().addFurniture(userFurniture);
                    }
                }
            }
        }

        data.trax.songs = data.trax.songs.filter((song) => song.id !== existingSong.id);
        data.trax.playlist = data.trax.playlist.filter((song) => song !== existingSong.id);

        await furniture.model.update({
            data,
            animation: (data.trax.playlist.length)?(furniture.model.animation):(0)
        });

        user.room.sendProtobuff(RoomFurnitureData, RoomFurnitureData.fromJSON({
            furnitureUpdated: [
                {
                    userId: user.model.id,
                    furniture: furniture.model
                }
            ]
        }));
    }
}
