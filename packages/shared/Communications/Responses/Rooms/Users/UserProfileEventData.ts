import { UserBadgeData } from "../../../../Interfaces/User/UserBadgeData.js";

export type UserProfileEventData = {
    userId: string;

    motto: string | null;
    badges: UserBadgeData[];
};
