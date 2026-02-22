import { HotelEventData } from "@shared/Communications/Responses/Hotel/HotelEventData.js";
import { game } from "../index.js";
import OutgoingEvent from "../Events/Interfaces/OutgoingEvent.js";
import { ServerStatsModel } from "../Database/Models/Server/ServerStatsModel.js";
import { randomUUID } from "node:crypto";

export default class ServerStats {
    public readonly startedAt: Date;
    public usersOnline: number;

    constructor() {
        this.startedAt = new Date();
        this.usersOnline = 0;
    }

    async updateUsersOnline() {
        this.usersOnline = game.users.length;

        for (let user of game.users) {
            user.send(new OutgoingEvent<HotelEventData>("HotelEvent", {
                users: game.users.length
            }));
        }

        const serverStats = await ServerStatsModel.findOne();
        if(!serverStats) {
            await ServerStatsModel.create({
                id: randomUUID(),
                onlines: game.users.length
            })
        }
        else {
            serverStats.update({
                onlines: game.users.length
            })
        }
    }
}