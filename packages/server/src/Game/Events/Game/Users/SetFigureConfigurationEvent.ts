import { RoomUserData, SetUserFigureConfigurationData } from "@pixel63/events";
import User from "../../../Users/User.js";
import { UserProtobuffListener } from "../../Interfaces/UserProtobuffListener.js";

export default class SetFigureConfigurationEvent implements UserProtobuffListener<SetUserFigureConfigurationData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: SetUserFigureConfigurationData) {
        if(!payload.figureConfiguration) {
            throw new Error();
        }
        
        user.model.figureConfiguration = payload.figureConfiguration;

        await user.model.save();

        if(user.room) {
            user.room.sendProtobuff(RoomUserData, RoomUserData.create({
                id: user.model.id,
                figureConfiguration: user.model.figureConfiguration
            }));
        }

        user.sendUserData();
    }
}
