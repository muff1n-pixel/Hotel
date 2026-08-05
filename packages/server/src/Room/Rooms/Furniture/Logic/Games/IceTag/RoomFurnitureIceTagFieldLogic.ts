import { RoomPositionOffsetData, UseRoomFurnitureData } from "@pixel63/events";
import RoomUser from "../../../../Users/RoomUser.js";
import RoomFurniture from "../../../RoomFurniture.js";
import RoomFurnitureLogic from "../../Interfaces/RoomFurnitureLogic.js";
import RoomFurnitureIceTagPoleLogic from "./RoomFurnitureIceTagPoleLogic.js";

export default class RoomFurnitureIceTagFieldLogic implements RoomFurnitureLogic {
    constructor(private readonly roomFurniture: RoomFurniture) {

    }

    async handleUserWalksOn(roomUser: RoomUser): Promise<void> {
        if(roomUser.pose.hasEffect("AvatarEffect.45") || roomUser.pose.hasEffect("AvatarEffect.46")) {
            const userInRadius = this.roomFurniture.room.users.find((targetRoomUser) => targetRoomUser.user.model.id !== roomUser.user.model.id && targetRoomUser.isWithinRadius(roomUser.position, 1));

            if(userInRadius) {
                roomUser.pose.removeEffect();

                if(roomUser.user.model.figureConfiguration.gender === "male") {
                    roomUser.pose.setEffect("AvatarEffect.38");
                }
                else {
                    roomUser.pose.setEffect("AvatarEffect.39");
                }
                
                userInRadius.pose.removeEffect();
                
                if(userInRadius.user.model.figureConfiguration.gender === "male") {
                    userInRadius.pose.setEffect("AvatarEffect.45");
                }
                else {
                    userInRadius.pose.setEffect("AvatarEffect.46");
                }

                await userInRadius.user.achievements.addAchievementScore("BladesOfGlory", 1);
            }

            return;
        }

        if(roomUser.pose.hasEffect("AvatarEffect.38") || roomUser.pose.hasEffect("AvatarEffect.39")) {
            return;
        }
        
        roomUser.pose.removeEffect();
        roomUser.pose.removeEffect();

        const usersPlaying = this.getUsersPlaying();
        const taggedRoomUsers = this.getTaggedRoomUsers();
        const tagPoles = this.getTagPoles();

        if(!taggedRoomUsers.length || (taggedRoomUsers.length < tagPoles.length && usersPlaying.length > taggedRoomUsers.length)) {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.pose.setEffect("AvatarEffect.45");
            }
            else {
                roomUser.pose.setEffect("AvatarEffect.46");
            }
        }
        else {
            if(roomUser.user.model.figureConfiguration.gender === "male") {
                roomUser.pose.setEffect("AvatarEffect.38");
            }
            else {
                roomUser.pose.setEffect("AvatarEffect.39");
            }
        }
    }
    
    async handleUserWalksOff(roomUser: RoomUser, newRoomFurniture: RoomFurniture[]): Promise<void> {
        if(!newRoomFurniture.some((furniture) => (furniture.logic instanceof RoomFurnitureIceTagFieldLogic))) {
            roomUser.pose.removeEffect();
        }
    }
    
    async handleUserLeftRoom(roomUser: RoomUser): Promise<void> {
        if(roomUser.pose.hasEffect("AvatarEffect.45") || roomUser.pose.hasEffect("AvatarEffect.46")) {
            const taggedRoomUsers = this.getTaggedRoomUsers();

            if(!taggedRoomUsers.length) {
                const usersPlaying = this.getUsersPlaying();
                
                if(usersPlaying.length) {
                    const taggedRoomUsers = this.getTaggedRoomUsers();
                    const tagPoles = this.getTagPoles();

                    if(!taggedRoomUsers.length || (taggedRoomUsers.length < tagPoles.length && usersPlaying.length > taggedRoomUsers.length)) {
                        const randomUser = usersPlaying[Math.floor(Math.random() * usersPlaying.length)];

                        if(randomUser) {
                            randomUser.pose.removeEffect();

                            if(randomUser.user.model.figureConfiguration.gender === "male") {
                                randomUser.pose.setEffect("AvatarEffect.45");
                            }
                            else {
                                randomUser.pose.setEffect("AvatarEffect.46");
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
            (user.pose.hasEffect("AvatarEffect.38") || user.pose.hasEffect("AvatarEffect.39"))
            || (user.pose.hasEffect("AvatarEffect.45") || user.pose.hasEffect("AvatarEffect.46"))
        ));
    }

    private getTaggedRoomUsers() {
        return this.roomFurniture.room.users.filter((user) => (
            (user.pose.hasEffect("AvatarEffect.45") || user.pose.hasEffect("AvatarEffect.46"))
        ));
    }

    private getTagPoles() {
        return this.roomFurniture.room.furnitures.filter((furniture) => furniture.logic instanceof RoomFurnitureIceTagPoleLogic);
    }
}