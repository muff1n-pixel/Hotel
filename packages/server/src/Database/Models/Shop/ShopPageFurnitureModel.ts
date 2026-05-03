import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { FurnitureModel } from "../Furniture/FurnitureModel.js";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageFurnitureModel extends Model {
    declare id: string;

    declare credits?: number;
    declare duckets?: number;
    declare diamonds?: number;

    declare membership?: string;
    
    declare furniture: NonAttribute<FurnitureModel>;

    declare shopPageId: NonAttribute<string>;
    declare shopPage: NonAttribute<ShopPageModel>;
}

export function initializeShopPageFurnitureModel(sequelize: Sequelize) {
    ShopPageFurnitureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          credits: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          duckets: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          diamonds: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
          },
          membership: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
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
    
    ShopPageFurnitureModel.belongsTo(ShopPageModel, {
        as: "shopPage",
        foreignKey: "shopPageId"
    });
    
    ShopPageModel.hasMany(ShopPageFurnitureModel, {
        as: "furniture",
        foreignKey: "shopPageId"
    });
}
