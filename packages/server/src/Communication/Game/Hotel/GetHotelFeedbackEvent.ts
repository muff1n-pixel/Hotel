import { HotelFeedbackModel } from "../../../Database/Models/Hotel/HotelFeedbackModel.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { UserModel } from "../../../Database/Models/Users/UserModel.js";
import { HotelFeedbackCollectionData } from "@pixel63/events/build/Hotel/Feedback/HotelFeedbackData.js";

export default class GetHotelFeedbackEvent implements IncomingEvent {
    public readonly name = "GetHotelFeedbackEvent";

    async handle(user: User) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("feedback:read")) {
            throw new Error("User is not privileged to read feedback reports.");
        }

        const feedback = await HotelFeedbackModel.findAll({
            where: {
                status: 0
            },
            include: [
                {
                    model: UserModel,
                    as: "user"
                }
            ]
        });

        user.sendProtobuff(HotelFeedbackCollectionData, HotelFeedbackCollectionData.create({
            feedback: feedback.map((feedback) => {
                return {
                    id: feedback.id,
                    user: {
                        id: feedback.user.id,
                        name: feedback.user.name,
                    },
                    area: feedback.area ?? undefined,
                    description: feedback.description,
                    status: feedback.status
                }
            })
        }));
    }
}
