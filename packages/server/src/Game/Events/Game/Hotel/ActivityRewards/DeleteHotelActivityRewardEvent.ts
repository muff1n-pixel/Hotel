import { DeleteHotelActivityRewardData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";
import { HotelActivityRewardModel } from "../../../../../Database/Models/Hotel/HotelActivityRewardModel";
import GetHotelActivityRewardsEvent from "./GetHotelActivityRewardsEvent";

export default class DeleteHotelActivityRewardEvent implements UserProtobuffListener<DeleteHotelActivityRewardData> {
    async handle(user: User, payload: DeleteHotelActivityRewardData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("hotel:activity_rewards")) {
            throw new Error("User is not privileged to update hotel activity rewards.");
        }

        await HotelActivityRewardModel.destroy({
            where: {
                id: payload.id
            }
        });

        await game.hotelActivityRewards.reloadActivityRewards();

        new GetHotelActivityRewardsEvent().handle(user);
    }
}
