import User from "../../../Users/User.js";
import ProtobuffListener from "../../Interfaces/ProtobuffListener.js";
import { SetUserMottoData } from "@pixel63/events";

export default class SetMottoEvent implements ProtobuffListener<SetUserMottoData> {
    public readonly name = "SetMottoEvent";

    async handle(user: User, payload: SetUserMottoData) {
        user.model.motto = payload.motto;

        if(user.model.changed()) {
            await user.model.save();
        }

        user.sendUserData();
    }
}
