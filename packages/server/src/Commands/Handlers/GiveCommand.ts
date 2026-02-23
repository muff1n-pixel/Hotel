import { UserEventData } from "@shared/Communications/Responses/User/UserEventData.js";
import OutgoingEvent from "../../Events/Interfaces/OutgoingEvent.js";
import RoomUser from "../../Rooms/Users/RoomUser.js";
import IncomingCommandHandler from "../Interfaces/IncomingCommandHandler.js";

export default class GiveCommand implements IncomingCommandHandler {
    public readonly command = "give";

    async handle(roomUser: RoomUser, inputs: string[]): Promise<void> {
        const permissions = await roomUser.user.getPermissions();

        if(!permissions.hasPermission("command:give")) {
            roomUser.sendRoomMessage(inputs.join());
            
            return;
        }

        const targetInput = inputs[0];

        if(!targetInput || !roomUser.room.users.some((user) => user.user.model.name === targetInput)) {
            roomUser.sendRoomMessage(inputs.join());

            return;
        }

        const currencyInput = inputs[1];

        if(!currencyInput || !["credits", "diamonds", "duckets"].includes(currencyInput)) {
            roomUser.sendRoomMessage(inputs.join());

            return;
        }

        const valueInput = inputs[2];

        if(!valueInput || isNaN(parseInt(valueInput))) {
            roomUser.sendRoomMessage(inputs.join());

            return;
        }

        const value = parseInt(valueInput);

        if(value < 0 || value > 1_000_000) {
            roomUser.sendRoomMessage(inputs.join());

            return;
        }

        const targetUser = roomUser.room.users.find((user) => user.user.model.name === targetInput);

        if(!targetUser) {
            roomUser.sendRoomMessage(inputs.join());

            return;
        }

        switch(currencyInput) {
            case "duckets":
            case "diamonds":
            case "credits": {
                targetUser.user.model[currencyInput] += value;

                break;
            }
        }

        await targetUser.user.model.save();
        
        targetUser.user.send(new OutgoingEvent<UserEventData>("UserEvent", targetUser.user.getUserData()));
    }
}
