import { UpdateHotelActivityRewardData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";
import { HotelActivityRewardModel } from "../../../../Database/Models/Hotel/HotelActivityRewardModel";
import { randomUUID } from "crypto";
import GetHotelActivityRewardsEvent from "./GetHotelActivityRewardsEvent";

export default class UpdateHotelActivityRewardEvent implements ProtobuffListener<UpdateHotelActivityRewardData> {
    async handle(user: User, payload: UpdateHotelActivityRewardData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("hotel:activity_rewards")) {
            throw new Error("User is not privileged to update hotel activity rewards.");
        }

        await HotelActivityRewardModel.upsert({
            id: payload.id ?? randomUUID(),

            interval: payload.interval,

            credits: payload.credits,
            duckets: payload.duckets,
            diamonds: payload.diamonds,
        });

        await game.hotelActivityRewards.reloadActivityRewards();

        new GetHotelActivityRewardsEvent().handle(user);
    }
}
