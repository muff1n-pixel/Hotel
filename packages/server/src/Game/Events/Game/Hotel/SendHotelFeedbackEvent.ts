import { randomUUID } from "node:crypto";
import { HotelFeedbackModel } from "../../../../Database/Models/Hotel/HotelFeedbackModel.js";
import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";
import { SendHotelFeedbackData } from "@pixel63/events";

export default class SendHotelFeedbackEvent implements UserProtobuffListener<SendHotelFeedbackData> {
    minimumDurationBetweenEvents?: number = 5000;

    async handle(user: User, payload: SendHotelFeedbackData) {
        await HotelFeedbackModel.create({
            id: randomUUID(),
            userId: user.model.id,
            area: (payload.area.length)?(payload.area):(null),
            description: payload.description
        });
    }
}
