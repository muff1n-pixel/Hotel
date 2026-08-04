import Command from "../../../Commands/Command";
import Room from "../../Room";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";

export default class PetCommand extends Command {
    constructor(room: Room, public readonly roomPet: RoomPet, input: string) {
        super(room, input, undefined)
    }
}
