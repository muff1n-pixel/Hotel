import { game } from "../index.js";
import { UserModel } from "../Database/Models/Users/UserModel.js";
import { HotelData } from "@pixel63/events";

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
            user.sendProtobuff(HotelData, HotelData.create({
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