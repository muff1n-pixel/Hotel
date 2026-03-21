import { UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../Users/RoomUser.js";
import RoomFurniture from "../RoomFurniture.js";
import RoomFurnitureLogic from "./Interfaces/RoomFurnitureLogic.js";

export default class RoomFurnitureIceTagFieldLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleUserWalksOn(roomUser: RoomUser): Promise<void> {
        if(roomUser.hasAction("AvatarEffect.45") || roomUser.hasAction("AvatarEffect.46")) {
            const userInRadius = this.roomFurniture.room.users.find((targetRoomUser) => targetRoomUser.user.model.id !== roomUser.user.model.id && targetRoomUser.isWithinRadius(roomUser.position, 1));

            if(userInRadius) {
                roomUser.removeAction("AvatarEffect");

                if(roomUser.user.model.figureConfiguration.gender === "male") {
                    roomUser.addAction("AvatarEffect.38");
                }
                else {
                    roomUser.addAction("AvatarEffect.39");
                }
                
                userInRadius.removeAction("AvatarEffect");
                
                if(userInRadius.user.model.figureConfiguration.gender === "male") {
                    userInRadius.addAction("AvatarEffect.45");
                }
                else {
                    userInRadius.addAction("AvatarEffect.46");
                }
            }

            return;
        }

        if(roomUser.hasAction("AvatarEffect.38") || roomUser.hasAction("AvatarEffect.39")) {
            return;
        }
        
        roomUser.removeAction("AvatarEffect");
        roomUser.removeAction("CarryItem");

        const taggedRoomUser = this.getTaggedRoomUser();

        if(taggedRoomUser) {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.addAction("AvatarEffect.38");
            }
            else {
                roomUser.addAction("AvatarEffect.39");
            }
        }
        else {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.addAction("AvatarEffect.45");
            }
            else {
                roomUser.addAction("AvatarEffect.46");
            }
        }
    }
    
    async handleUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture | undefined): Promise<void> {
        if(!(newRoomFurniture?.logic instanceof RoomFurnitureIceTagFieldLogic)) {
            roomUser.removeAction("AvatarEffect.38");
            roomUser.removeAction("AvatarEffect.39");

            roomUser.removeAction("AvatarEffect.45");
            roomUser.removeAction("AvatarEffect.46");
        }
    }
    
    async handleUserLeftRoom(roomUser: RoomUser): Promise<void> {
        if(roomUser.hasAction("AvatarEffect.45") || roomUser.hasAction("AvatarEffect.46")) {
            const taggedRoomUser = this.getTaggedRoomUser();

            if(!taggedRoomUser) {
                const usersPlaying = this.roomFurniture.room.users.filter((user) => user.hasAction("AvatarEffect.38") || user.hasAction("AvatarEffect.39"));

                if(usersPlaying.length) {
                    const randomUser = usersPlaying[Math.floor(Math.random() * usersPlaying.length)];

                    if(randomUser) {
                        randomUser.removeAction("AvatarEffect");

                        if(randomUser.user.model.figureConfiguration.gender === "male") {
                            randomUser.addAction("AvatarEffect.45");
                        }
                        else {
                            randomUser.addAction("AvatarEffect.46");
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

    private getTaggedRoomUser() {
        return this.roomFurniture.room.users.find((user) => (
            (user.hasAction("AvatarEffect.45") || user.hasAction("AvatarEffect.46"))
        ));
    }
}