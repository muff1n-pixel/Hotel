import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetFigureConfigurationEventData } from "@shared/Communications/Requests/User/SetFigureConfigurationEventData.js";
import { UserFigureConfigurationEventData } from "@shared/Communications/Responses/Rooms/Users/UserFigureConfigurationEventData.js";

export default class SetFigureConfigurationEvent implements IncomingEvent<SetFigureConfigurationEventData> {
    public readonly name = "SetFigureConfigurationEvent";

    async handle(user: User, event: SetFigureConfigurationEventData) {
        user.model.figureConfiguration = event.figureConfiguration;

        await user.model.save();

        if(user.room) {
            user.room.sendRoomEvent(
                new OutgoingEvent<UserFigureConfigurationEventData>("UserFigureConfigurationEvent", {
                    userId: user.model.id,
                    figureConfiguration: user.model.figureConfiguration
                })
            );
        }

        user.sendUserData();
    }
}
