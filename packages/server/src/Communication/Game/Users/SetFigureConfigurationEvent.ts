import { RoomUserData, SetUserFigureConfigurationData } from "@pixel63/events";
import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";

export default class SetFigureConfigurationEvent implements ProtobuffListener<SetUserFigureConfigurationData> {
    public readonly name = "SetFigureConfigurationEvent";

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
