import { BadgeData, GetUserHabboClubData, UserHabboClubData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserHabboClubEvent implements UserProtobuffListener<GetUserHabboClubData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User) {
        user.habboClub.sendHabboClubData();
    }
}
