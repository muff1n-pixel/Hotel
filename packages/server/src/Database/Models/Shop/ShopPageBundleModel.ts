import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";
import { RoomModel } from "../Rooms/RoomModel.js";

export class ShopPageBundleModel extends Model {
    declare id: string;

    declare credits?: number;
    declare duckets?: number;
    declare diamonds?: number;

    declare room: NonAttribute<RoomModel>;
    declare page: NonAttribute<ShopPageModel>;
}

export function initializeShopPageBundleModel(sequelize: Sequelize) {
    ShopPageBundleModel.init(
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
            }
        },
        {
            tableName: "shop_page_bundles",
            sequelize
        }
    );

    ShopPageBundleModel.belongsTo(ShopPageModel, {
        as: "page",
        foreignKey: "pageId"
    });

    ShopPageModel.belongsTo(ShopPageBundleModel, {
        as: "bundle",
        foreignKey: "bundleId"
    });

    ShopPageBundleModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId"
    });
}
