import { RoomPositionOffsetData } from "@pixel63/events";
import Directions from "../../../../../Helpers/Directions";
import RoomFurnitureFootballLogic from "../../../Furniture/Logic/Games/RoomFurnitureFootballLogic";
import RoomUser from "../../../Users/RoomUser";
import { RoomPetState } from "../../RoomPet";
import PetCommand from "../PetCommand";
import RoomFurniture from "../../../Furniture/RoomFurniture";
import RoomPetPlayFootballAction from "../../Actions/RoomPetPlayFootballAction";

export default class PetPlayFootballCommand extends PetCommand {
    async handle(roomUser: RoomUser): Promise<void> {
        if(this.roomPet.model.energy < 10) {
            this.roomPet.sendVocal("DISOBEY");

            return;
        }

        this.roomPet.action = new RoomPetPlayFootballAction(this.roomPet);
    }
}
