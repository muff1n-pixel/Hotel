import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { WebHomeShopPageItemModel } from "../Item/WebHomeShopPageItem";

export class WebHomeShopPageModel extends Model {
    declare id: string;
    declare parentId?: string;
    declare title: string;
    declare description?: string;
    declare activeForUsers?: boolean;
    declare activeForGroups?: boolean;
    declare visible?: boolean;

    declare items: NonAttribute<WebHomeShopPageItemModel[]>;
}

export function initializeWebHomeShopPageModel(sequelize: Sequelize) {
    WebHomeShopPageModel.init(
        {
            id: {
                type: DataTypes.STRING(500),
                primaryKey: true
            },
            parentId: {
                type: DataTypes.STRING(500),
                primaryKey: false,
                defaultValue: null,
                allowNull: true
            },
            title: {
                type: new DataTypes.STRING(50),
                allowNull: false
            },
            description: {
                type: new DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null
            },
            activeForUsers: {
                type: new DataTypes.BOOLEAN,
                defaultValue: true
            }
            ,
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
            tableName: "web_home_shop_pages",
            sequelize
        }
    );
}
