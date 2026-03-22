import { RoomPositionData, RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "./../../Interfaces/RoomFurnitureLogic.js";
import RoomFurnitureBunnyRunPoleLogic from "./RoomFurnitureBunnyRunPoleLogic.js";

export default class RoomFurnitureBunnyRunFieldLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleUserWalksOn(roomUser: RoomUser): Promise<void> {
        if(roomUser.hasAction("AvatarEffect.68")) {
            const userInRadius = this.roomFurniture.room.users.find((targetRoomUser) => targetRoomUser.user.model.id !== roomUser.user.model.id && targetRoomUser.isWithinRadius(roomUser.position, 1) && targetRoomUser.position && targetRoomUser.room.getUpmostFurnitureAtPosition(RoomPositionOffsetData.fromJSON(targetRoomUser.position))?.logic instanceof RoomFurnitureBunnyRunFieldLogic);

            if(userInRadius) {
                roomUser.removeAction("AvatarEffect");
                
                userInRadius.removeAction("AvatarEffect");
                userInRadius.addAction("AvatarEffect.68");
            }

            return;
        }

        const usersPlaying = this.getUsersPlaying();
        const taggedRoomUsers = this.getTaggedRoomUsers();
        const tagPoles = this.getTagPoles();

        if(!taggedRoomUsers.length || (taggedRoomUsers.length < tagPoles.length && usersPlaying.length > taggedRoomUsers.length)) {
            roomUser.removeAction("AvatarEffect");
            roomUser.addAction("AvatarEffect.68");
        }
    }
    
    async handleUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!newRoomFurniture.some((furniture) => (furniture.logic instanceof RoomFurnitureBunnyRunFieldLogic))) {
            roomUser.removeAction("AvatarEffect.68");
        }
    }
    
    async handleUserLeftRoom(roomUser: RoomUser): Promise<void> {
        if(roomUser.hasAction("AvatarEffect.68")) {
            const taggedRoomUsers = this.getTaggedRoomUsers();

            if(!taggedRoomUsers.length) {
                const usersPlaying = this.getUsersPlaying();
                
                if(usersPlaying.length) {
                    const taggedRoomUsers = this.getTaggedRoomUsers();
                    const tagPoles = this.getTagPoles();

                    if(!taggedRoomUsers.length || (taggedRoomUsers.length < tagPoles.length && usersPlaying.length > taggedRoomUsers.length)) {
                        const randomUser = usersPlaying[Math.floor(Math.random() * usersPlaying.length)];

                        if(randomUser) {
                            randomUser.removeAction("AvatarEffect");
                            randomUser.addAction("AvatarEffect.68");
                        }
                    }
                }
            }
        }
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }

    private getUsersPlaying() {
        return this.roomFurniture.room.users.filter((user) => (
            user.position && user.room.getUpmostFurnitureAtPosition(RoomPositionOffsetData.fromJSON(user.position))?.logic instanceof RoomFurnitureBunnyRunFieldLogic
        ));
    }

    private getTaggedRoomUsers() {
        return this.roomFurniture.room.users.filter((user) => user.hasAction("AvatarEffect.68"));
    }

    private getTagPoles() {
        return this.roomFurniture.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureBunnyRunPoleLogic);
    }
}