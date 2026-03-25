import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageFeatureModel extends Model {
    declare id: string;

    declare title: string;
    declare image: string;

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
            configuration: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("configuration"));
                },
                set: function (value) {
                    this.setDataValue("configuration", JSON.stringify(value));
                },
                allowNull: false
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

    ShopPageModel.belongsTo(ShopPageFeatureModel, {
        as: "featureVertical",
        foreignKey: "featureVerticalId"
    });

    ShopPageModel.belongsTo(ShopPageFeatureModel, {
        as: "featureHorizontalTop",
        foreignKey: "featureHorizontalTopId"
    });

    ShopPageModel.belongsTo(ShopPageFeatureModel, {
        as: "featureHorizontalMiddle",
        foreignKey: "featureHorizontalMiddleId"
    });

    ShopPageModel.belongsTo(ShopPageFeatureModel, {
        as: "featureHorizontalBottom",
        foreignKey: "featureHorizontalBottomId"
    });
}
