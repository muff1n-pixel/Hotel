import { Model } from "sequelize";
import { RoomPosition } from "@shared/Interfaces/Room/RoomPosition.js";
import { NonAttribute } from "@sequelize/core";
import { Furniture } from "../Furniture/Furniture";

export class RoomFurniture extends Model {
    declare id: string;
    declare position: RoomPosition;
    declare direction: number;
    declare animation: number;

    declare furniture: NonAttribute<Furniture>;
}
