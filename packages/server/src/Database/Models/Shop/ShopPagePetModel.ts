import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { ShopPageModel } from "./ShopPageModel.js";
import { PetModel } from "../Pets/PetModel.js";

export class ShopPagePetModel extends Model {
    declare id: string;

    declare credits?: number;
    declare duckets?: number;
    declare diamonds?: number;

    declare pet: NonAttribute<PetModel>;
}

export function initializeShopPagePetModel(sequelize: Sequelize) {
    ShopPagePetModel.init(
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
        },
        {
          tableName: "shop_page_pets",
          sequelize
        }
    );
        
    ShopPagePetModel.belongsTo(PetModel, {
        as: "pet",
        foreignKey: "petId"
    });
    
    ShopPageModel.hasMany(ShopPagePetModel, {
        as: "pets",
        foreignKey: "shopPageId"
    });
}
