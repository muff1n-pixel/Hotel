import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../../Events/Interfaces/OutgoingEvent.js";
import User from "../../../Users/User.js";
import IncomingEvent from "../../Interfaces/IncomingEvent.js";
import { SetMottoEventData } from "@shared/Communications/Requests/User/SetMottoEventData.js";

export default class SetMottoEvent implements IncomingEvent<SetMottoEventData> {
    public readonly name = "SetMottoEvent";

    async handle(user: User, event: SetMottoEventData) {
        user.model.motto = event.motto;

        if(user.model.changed()) {
            await user.model.save();
        }

        user.send(new OutgoingEvent<UserEventData>("UserEvent", user.getUserData()));
    }
}
