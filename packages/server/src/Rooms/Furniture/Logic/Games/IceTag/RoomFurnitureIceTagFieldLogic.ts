import { RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "./../../Interfaces/RoomFurnitureLogic.js";
import RoomFurnitureIceTagPoleLogic from "./RoomFurnitureIceTagPoleLogic.js";

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

                await userInRadius.user.achievements.addAchievementScore("BladesOfGlory", 1);
            }

            return;
        }

        if(roomUser.hasAction("AvatarEffect.38") || roomUser.hasAction("AvatarEffect.39")) {
            return;
        }
        
        roomUser.removeAction("AvatarEffect");
        roomUser.removeAction("CarryItem");

        const usersPlaying = this.getUsersPlaying();
        const taggedRoomUsers = this.getTaggedRoomUsers();
        const tagPoles = this.getTagPoles();

        if(!taggedRoomUsers.length || (taggedRoomUsers.length < tagPoles.length && usersPlaying.length > taggedRoomUsers.length)) {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.addAction("AvatarEffect.45");
            }
            else {
                roomUser.addAction("AvatarEffect.46");
            }
        }
        else {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.addAction("AvatarEffect.38");
            }
            else {
                roomUser.addAction("AvatarEffect.39");
            }
        }
    }
    
    async handleUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!newRoomFurniture.some((furniture) => (furniture.logic instanceof RoomFurnitureIceTagFieldLogic))) {
            roomUser.removeAction("AvatarEffect.38");
            roomUser.removeAction("AvatarEffect.39");

            roomUser.removeAction("AvatarEffect.45");
            roomUser.removeAction("AvatarEffect.46");
        }
    }
    
    async handleUserLeftRoom(roomUser: RoomUser): Promise<void> {
        if(roomUser.hasAction("AvatarEffect.45") || roomUser.hasAction("AvatarEffect.46")) {
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
    }

    async use(roomUser: RoomUser, payload: UseRoomFurnitureData): Promise<void> {

    }

    async handleActionsInterval(): Promise<void> {
        
    }

    async handleMinuteInterval(): Promise<void> {
        const users = this.roomFurniture.room.users.filter((user) => this.roomFurniture.isPositionInside(RoomPositionOffsetData.fromJSON(user.position)));

        for(const roomUser of users) {
            await roomUser.user.achievements.addAchievementScore("IceIceBadge", 1);
        } 
    }

    private getUsersPlaying() {
        return this.roomFurniture.room.users.filter((user) => (
            (user.hasAction("AvatarEffect.38") || user.hasAction("AvatarEffect.39"))
            || (user.hasAction("AvatarEffect.45") || user.hasAction("AvatarEffect.46"))
        ));
    }

    private getTaggedRoomUsers() {
        return this.roomFurniture.room.users.filter((user) => (
            (user.hasAction("AvatarEffect.45") || user.hasAction("AvatarEffect.46"))
        ));
    }

    private getTagPoles() {
        return this.roomFurniture.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureIceTagPoleLogic);
    }
}