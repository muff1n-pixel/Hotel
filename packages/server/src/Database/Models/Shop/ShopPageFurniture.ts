import { NonAttribute } from "@sequelize/core";
import { Model } from "sequelize";
import { Furniture } from "../Furniture/Furniture";

export class ShopPageFurniture extends Model {
    declare id: string;
    
    declare furniture: NonAttribute<Furniture>;
}
