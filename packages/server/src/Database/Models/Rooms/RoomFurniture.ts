import { Model } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";

export class RoomFurniture extends Model {
    declare id: string;
    declare type: string;
    declare position: RoomPosition;
    declare direction: number;
    declare animation: number;
    declare color: number;
}
