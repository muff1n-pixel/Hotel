import { BadgeData, UserHabboClubData } from "@pixel63/events";
import GetUserHabboClubEvent from "../../Communication/Game/Users/HabboClub/GetUserHabboClubEvent";
import User from "../User";

export default class UserHabboClub {
    constructor(private readonly user: User) {

    }

    public isActive() {
        return Boolean(this.user.model.habboClub && new Date(this.user.model.habboClub) >= new Date());
    }

    public addCashback(credits: number) {
        if(!this.isActive()) {
            return;
        }

        this.user.model.habboClubCashback += Math.round(credits / 100 * 10);
    }

    public getCashback() {
        let credits: number = this.user.model.habboClubCashback;

        if(this.user.model.habboClubStreak >= 365) {
            credits += 30;
        }
        else if(this.user.model.habboClubStreak >= 180) {
            credits += 25;
        }
        else if(this.user.model.habboClubStreak >= 90) {
            credits += 20;
        }
        else if(this.user.model.habboClubStreak >= 60) {
            credits += 15;
        }
        else if(this.user.model.habboClubStreak >= 30) {
            credits += 10;
        }
        else if(this.user.model.habboClubStreak >= 7) {
            credits += 5;
        }

        return credits;
    }

    public async addMembershipDays(days: number) {
        const date = (this.user.model.habboClub && new Date(this.user.model.habboClub) >= new Date())?(new Date(this.user.model.habboClub)):(new Date());

        if(!this.isActive()) {
            this.user.model.habboClubStreak = 0;
            this.user.model.habboClubCashbackRedemeedAt = new Date();
        }

        date.setDate(date.getDate() + days);

        this.user.model.habboClub = date;
        this.user.model.habboClubDays += days;
        this.user.model.habboClubStreak += days;

        if(!this.user.model.habboClubFirstMembership) {
            this.user.model.habboClubFirstMembership = new Date();
        }

        await this.user.achievements.addAchievementScore("HabboClubMember", days);

        await new GetUserHabboClubEvent().handle(this.user);
    }

    public async sendHabboClubData() {
        const active = this.isActive();

        const userAchievementBadge = await this.user.achievements.getUserAchievementBadge("HabboClubMember");

        this.user.sendProtobuff(UserHabboClubData, UserHabboClubData.create({
            active: active,
            expiresAt: (active && this.user.model.habboClub)?(new Date(this.user.model.habboClub).toISOString()):(undefined),
            memberSince: (this.user.model.habboClubFirstMembership)?(new Date(this.user.model.habboClubFirstMembership).toISOString()):(undefined),
            membershipDays: this.user.model.habboClubDays,
            membershipStreak: this.user.model.habboClubStreak,
            cashback: this.getCashback(),
            gifts: this.user.model.habboClubGifts,

            badge: (userAchievementBadge)?(BadgeData.fromJSON(userAchievementBadge)):(undefined)
        }));
    }

    public async redeemCashback() {
        if (!this.isActive()) {
            return;
        }

        const now = new Date();
        const currentPeriodStart = new Date(now);

        if (now.getDate() >= 15) {
            currentPeriodStart.setDate(15);
        } else {
            currentPeriodStart.setMonth(currentPeriodStart.getMonth() - 1);
            currentPeriodStart.setDate(15);
        }

        if (this.user.model.habboClubCashbackRedemeedAt && this.user.model.habboClubCashbackRedemeedAt >= currentPeriodStart) {
            return;
        }

        this.user.model.credits += this.getCashback();
        
        this.user.model.habboClubCashback = 0;
        this.user.model.habboClubCashbackRedemeedAt = now;
        this.user.model.habboClubGifts++;

        this.user.sendUserData();

        await this.user.model.save();
    }
}
