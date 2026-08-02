import { HotelActivityRewardModel } from "../Database/Models/Hotel/HotelActivityRewardModel";
import Game from "../Game";

export default class HotelActivityRewards {
    public activityRewards: HotelActivityRewardModel[] = [];

    constructor(private readonly game: Game) {
        setInterval(this.handleInterval.bind(this), 60 * 1000);
    }

    public async reloadActivityRewards() {
        this.activityRewards = await HotelActivityRewardModel.findAll();
    }

    private async handleInterval() {
        const timestamp = performance.now();

        for(const user of this.game.users) {
            let userRewardGiven = false;

            for(const activityReward of this.activityRewards) {
                const latestRewardTimestamp = user.activityRewards.get(activityReward.id) ?? user.loggedInAt;
                const latestRewardElapsedSeconds = (timestamp - latestRewardTimestamp) / 1000;

                if(latestRewardElapsedSeconds < activityReward.interval) {
                    continue;
                }

                user.activityRewards.set(activityReward.id, timestamp);

                if(activityReward.credits) {
                    user.model.credits += activityReward.credits;
                }
                
                if(activityReward.duckets) {
                    user.model.duckets += activityReward.duckets;
                }
                
                if(activityReward.diamonds) {
                    user.model.diamonds += activityReward.diamonds;
                }

                userRewardGiven = true;
            }

            if(userRewardGiven) {
                user.sendUserData();

                await user.model.save();
            }
        }
    }
}