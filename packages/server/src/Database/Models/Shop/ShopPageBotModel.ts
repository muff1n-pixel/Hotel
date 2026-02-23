import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";
import { BotTypeData } from "@shared/Interfaces/Bots/BotTypeData.js";
import { FigureConfiguration } from "@shared/Interfaces/Figure/FigureConfiguration.js";

export class ShopPageBotModel extends Model {
    declare id: string;

    declare credits?: number;
    declare duckets?: number;
    declare diamonds?: number;

    declare name: string;
    declare motto: string | null;

    declare figureConfiguration: FigureConfiguration;

    declare type: BotTypeData;
}

export function initializeShopPageBotModel(sequelize: Sequelize) {
    ShopPageBotModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },

          name: {
            type: DataTypes.STRING,
            allowNull: false
          },
          motto: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
          },

          type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "default"
          },

          figureConfiguration: {
              type: DataTypes.TEXT,
              get: function () {
                  return JSON.parse(this.getDataValue("figureConfiguration"));
              },
              set: function (value) {
                  this.setDataValue("figureConfiguration", JSON.stringify(value));
              },
              allowNull: false
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
        },
        {
          tableName: "shop_page_bots",
          sequelize
        }
    );
    
    ShopPageModel.hasMany(ShopPageBotModel, {
        as: "bots",
        foreignKey: "shopPageId"
    });
}
