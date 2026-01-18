import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { FurnitureModel } from "../Furniture/FurnitureModel.js";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageFurnitureModel extends Model {
    declare id: string;
    
    declare furniture: NonAttribute<FurnitureModel>;
}

export function initializeShopPageFurnitureModel(sequelize: Sequelize) {
    ShopPageFurnitureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          }
        },
        {
          tableName: "shop_page_furnitures",
          sequelize
        }
    );
    
    ShopPageFurnitureModel.belongsTo(FurnitureModel, {
        as: "furniture",
        foreignKey: "furnitureId"
    });
    
    ShopPageModel.hasMany(ShopPageFurnitureModel, {
        as: "furniture",
        foreignKey: "shopPageId"
    });
}
