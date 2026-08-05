import { GetHotelActivityRewardsData, HotelActivityRewardsData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";
import { HotelActivityRewardData } from "@pixel63/events/build/Client/Hotel/ActivityRewards/HotelActivityRewardsData";

export default class GetHotelActivityRewardsEvent implements UserProtobuffListener<GetHotelActivityRewardsData> {
    async handle(user: User) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("hotel:activity_rewards")) {
            throw new Error("User is not privileged to read hotel activity rewards.");
        }

        user.sendProtobuff(HotelActivityRewardsData, HotelActivityRewardsData.create({
            activityRewards: game.hotelActivityRewards.activityRewards.map((activityReward) => {
                return HotelActivityRewardData.fromJSON(activityReward)
            })
        }));
    }
}
