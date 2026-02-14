import { UserBadgeData } from "../../../../Interfaces/User/UserBadgeData.js";

export type UserBadgesEventData = {
    userId: string;
    badges: UserBadgeData[];
};
