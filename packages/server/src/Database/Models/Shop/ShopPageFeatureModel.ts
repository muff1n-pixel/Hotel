import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageFeatureModel extends Model {
    declare id: string;

    declare type: "horizontal" | "vertical";

    declare title: string;
    declare image: string;

    declare index: number;

    declare featuredPage: NonAttribute<ShopPageModel>;
}

export function initializeShopPageFeatureModel(sequelize: Sequelize) {
    ShopPageFeatureModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          image: {
            type: DataTypes.STRING,
            allowNull: false
          },
          index: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
          },
          type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "horizontal"
          }
        },
        {
          tableName: "shop_page_features",
          sequelize
        }
    );

    ShopPageFeatureModel.belongsTo(ShopPageModel, {
        as: "featuredPage",
        foreignKey: "featuredPageId"
    });

    ShopPageModel.hasMany(ShopPageFeatureModel, {
        as: "features",
        foreignKey: "pageId"
    });
}
