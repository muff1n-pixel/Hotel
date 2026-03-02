import { randomUUID } from "node:crypto";
import { HotelFeedbackModel } from "../../../Database/Models/Hotel/HotelFeedbackModel.js";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { SendHotelFeedbackData } from "@pixel63/events";

export default class SendHotelFeedbackEvent implements ProtobuffListener<SendHotelFeedbackData> {
    async handle(user: User, payload: SendHotelFeedbackData) {
        await HotelFeedbackModel.create({
            id: randomUUID(),
            userId: user.model.id,
            area: (payload.area.length)?(payload.area):(null),
            description: payload.description
        });
    }
}
