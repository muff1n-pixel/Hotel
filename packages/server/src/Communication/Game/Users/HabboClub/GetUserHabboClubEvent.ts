import { GetUserHabboClubData, UserHabboClubData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserHabboClubEvent implements ProtobuffListener<GetUserHabboClubData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User) {
        const active = Boolean((user.model.habboClub && new Date(user.model.habboClub) >= new Date()));

        user.sendProtobuff(UserHabboClubData, UserHabboClubData.create({
            active: active,
            expiresAt: (active && user.model.habboClub)?(new Date(user.model.habboClub).toISOString()):(undefined),
            memberSince: (user.model.habboClubFirstMembership)?(new Date(user.model.habboClubFirstMembership).toISOString()):(undefined),
            membershipDays: user.model.habboClubDays,
            membershipStreak: user.model.habboClubStreak
        }));
    }
}
