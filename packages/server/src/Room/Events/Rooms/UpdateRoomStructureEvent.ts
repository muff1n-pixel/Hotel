import { RoomPositionData, RoomStructureData, UpdateRoomStructureData } from "@pixel63/events";
import { RoomProtobuffListener } from "../Interfaces/RoomProtobuffListener.js";
import User from "../../Users/User.js";

export default class UpdateRoomStructureEvent implements RoomProtobuffListener<UpdateRoomStructureData> {
    minimumDurationBetweenEvents?: number = 1000;

    async handle(user: User, payload: UpdateRoomStructureData) {
        if(!user.roomUser.hasRights()) {
            throw new Error("User does not have room rights.");
        }

        const structure = RoomStructureData.create(user.roomUser.room.model.structure);

        if(payload.floorThickness !== undefined && [0, 4, 8, 12, 16].includes(payload.floorThickness)) {
            structure.floor!.thickness = payload.floorThickness;
        }
        
        if(payload.wallThickness !== undefined && [0, 4, 8, 12, 16].includes(payload.wallThickness)) {
            structure.wall!.thickness = payload.wallThickness;
        }
        
        if(payload.wallHeight !== undefined) {
            structure.wall!.height = Math.min(10, Math.max(0, payload.wallHeight));
        }
        
        if(payload.wallHidden !== undefined) {
            structure.wall!.hidden = Boolean(payload.wallHidden);
        }

        if(payload.grid && payload.grid.length) {
            structure.grid = payload.grid;
        }

        if(payload.door) {
            structure.door = payload.door;
        }

        if(payload.offset) {
            if(payload.offset.row > 0 || payload.offset.column > 0) {
                for(const furniture of user.roomUser.room.furnitures) {
                    await furniture.setPosition(RoomPositionData.create({
                        row: furniture.model.position.row + payload.offset.row,
                        column: furniture.model.position.column + payload.offset.column,
                        depth: furniture.model.position.depth
                    }));
                }
                
                for(const roomUser of user.roomUser.room.users) {
                    roomUser.path.setPosition(RoomPositionData.create({
                        row: roomUser.position.row + payload.offset.row,
                        column: roomUser.position.column + payload.offset.column,
                        depth: roomUser.position.depth
                    }));
                }
            }
        }
        
        await user.roomUser.room.setStructure(structure);
    }
}
