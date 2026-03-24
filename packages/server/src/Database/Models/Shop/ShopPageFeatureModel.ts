import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageFeatureModel extends Model {
    declare id: string;

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

    ShopPageModel.hasOne(ShopPageFeatureModel, {
        as: "featureVertical",
        foreignKey: "featureVerticalId"
    });

    ShopPageModel.hasOne(ShopPageFeatureModel, {
        as: "featureHorizontalTop",
        foreignKey: "featureHorizontalTopId"
    });

    ShopPageModel.hasOne(ShopPageFeatureModel, {
        as: "featureHorizontalMiddle",
        foreignKey: "featureHorizontalMiddleId"
    });

    ShopPageModel.hasOne(ShopPageFeatureModel, {
        as: "featureHorizontalBottom",
        foreignKey: "featureHorizontalBottomId"
    });
}
