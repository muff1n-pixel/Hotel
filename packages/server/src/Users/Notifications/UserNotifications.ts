import { UserNotificationsData } from "@pixel63/events";
import User from "../User";
import { UserNotificationModel } from "../../Database/Models/Users/Notifications/UserNotificationModel";
import { game } from "../..";

export default class UserNotifications {
    constructor(private readonly userId: string) {

    }

    public async addNotification(type: string, count: number = 1) {
        const [affectedRows] = await UserNotificationModel.increment({
            count
        }, {
            where: {
                userId: this.userId,
                type
            }
        });

        if(!affectedRows) {
            await UserNotificationModel.create({
                type,
                userId: this.userId,
                count
            });
        }

        const user = game.getUserById(this.userId);

        if(user) {
            const userNotifications = await UserNotificationModel.findAll({
                where: {
                    userId: this.userId
                }
            });

            user.sendProtobuff(UserNotificationsData, UserNotificationsData.create({
                notifications: userNotifications.map((userNotification) => userNotification.toJSON())
            }));
        }
    }
}
