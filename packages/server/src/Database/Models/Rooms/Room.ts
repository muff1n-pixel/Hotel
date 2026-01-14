import { Model, NonAttribute } from "sequelize";
import { RoomStructure } from "@shared/Interfaces/Room/RoomStructure.js";
import { RoomFurniture } from "./RoomFurniture.js";

export class Room extends Model {
    declare id: string;
    declare name: string;
    declare structure: RoomStructure;
    
    declare roomFurnitures: NonAttribute<RoomFurniture[]>;
}
