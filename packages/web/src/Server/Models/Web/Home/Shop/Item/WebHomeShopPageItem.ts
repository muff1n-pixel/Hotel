import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { WebHomeItemModel } from "../../Item/WebHomeItemModel";
import { WebHomeShopPageModel } from "../Page/WebHomeShopPageModel";

export class WebHomeShopPageItemModel extends Model {
    declare id: string;
    declare credits: number;
    declare duckets: number;
    declare diamonds: number;
    declare activeForUsers?: boolean;
    declare activeForGroups?: boolean;
    declare visible?: boolean;

    declare item: NonAttribute<WebHomeItemModel>;
    declare shopPageId: NonAttribute<string>;
}

export function initialize(sequelize: Sequelize) {
    WebHomeShopPageItemModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            credits: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            duckets: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            diamonds: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            activeForUsers: {
                type: new DataTypes.BOOLEAN,
                defaultValue: true
            },
            activeForGroups: {
                type: new DataTypes.BOOLEAN,
                defaultValue: true
            },
            visible: {
                type: new DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "web_home_shop_page_items",
            sequelize
        }
    );
}

export function associate() {
    WebHomeShopPageItemModel.belongsTo(WebHomeItemModel, {
        as: "item",
        foreignKey: "itemId"
    });

    WebHomeShopPageModel.hasMany(WebHomeShopPageItemModel, {
        as: "item",
        foreignKey: "shopPageId"
    });
}