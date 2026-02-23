import { HotelEventData } from "@shared/Communications/Responses/Hotel/HotelEventData.js";
import { game } from "../index.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";

export default class HotelInformation {
    private previousUserCount: number = 0;

    constructor() {
    }

    async updateUsersCount() {
        if(this.previousUserCount === game.users.length) {
            return;
        }

        this.previousUserCount = game.users.length;

        for (const user of game.users) {
            user.send(new OutgoingEvent<HotelEventData>("HotelEvent", {
                users: game.users.length
            }));
        }
    }

    public async resetUsersOnline() {
        await UserModel.update({
            online: false
        }, {
            validate: false,
            where: {
                online: true
            }
        });
    }
}