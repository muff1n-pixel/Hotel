import { BadgeData, GetUserHabboClubData, UserHabboClubData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserHabboClubEvent implements ProtobuffListener<GetUserHabboClubData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User) {
        user.habboClub.sendHabboClubData();
    }
}
