import { Model } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition";

export class Furniture extends Model {
    declare id: string;
    declare type: string;
    declare placement: "floor" | "wall";
    declare dimensions: RoomPosition;
    declare color?: number;
}
