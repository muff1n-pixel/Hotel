import { BadgeData } from "../Badges/BadgeData.js";

export type UserBadgeData = {
    id: string;
    
    badge: BadgeData;

    equipped: boolean;
};
