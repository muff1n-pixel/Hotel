import { NonAttribute } from "@sequelize/core";
import { DataTypes, Model, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";

export class ShopPageMembershipModel extends Model {
    declare id: string;

    declare membership: string;

    declare credits?: number;
    declare duckets?: number;
    declare diamonds?: number;

    declare days: number;
    
    declare shopPageId: NonAttribute<string>;
    declare shopPage: NonAttribute<ShopPageModel>;
}

export function initializeShopPageMembershipModel(sequelize: Sequelize) {
    ShopPageMembershipModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          membership: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          days: {
            type: DataTypes.INTEGER,
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
          tableName: "shop_page_memberships",
          sequelize
        }
    );
    
    ShopPageMembershipModel.belongsTo(ShopPageModel, {
        as: "shopPage",
        foreignKey: "shopPageId"
    });
    
    ShopPageModel.hasMany(ShopPageMembershipModel, {
        as: "memberships",
        foreignKey: "shopPageId"
    });
}
