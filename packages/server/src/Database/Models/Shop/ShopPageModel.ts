import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { ShopPageFurnitureModel } from "./ShopPageFurnitureModel.js";
import { ShopPageFeatureModel } from "./ShopPageFeatureModel.js";
import { ShopPageBotModel } from "./ShopPageBotModel.js";

export class ShopPageModel extends Model {
    declare id: string;
    declare parentId?: string;
    
    declare index: number;
    
    declare title: string;
    declare description: string;

    declare category: "frontpage" | "furniture" | "clothing" | "pets";
    declare type: "default";

    declare icon: string | null;
    declare header: string | null;
    declare teaser: string | null;
    
    declare furniture: NonAttribute<ShopPageFurnitureModel[]>;
    declare bots: NonAttribute<ShopPageBotModel[]>;
    declare features?: NonAttribute<ShopPageFeatureModel[]>;
}

export function initializeShopPageModel(sequelize: Sequelize) {
    ShopPageModel.init(
        {
          id: {
            type: DataTypes.UUID,
            primaryKey: true
          },
          parentId: {
            type: DataTypes.UUID,
            primaryKey: false,
            defaultValue: null,
            allowNull: true
          },
          index: {
            type: DataTypes.INTEGER,
          },
          category: {
            type: new DataTypes.STRING(32),
            allowNull: false
          },
          type: {
            type: new DataTypes.STRING(32),
            allowNull: false,
            defaultValue: "default"
          },
          title: {
            type: new DataTypes.STRING(32),
            allowNull: false
          },
          description: {
            type: new DataTypes.STRING(512),
            allowNull: true,
            defaultValue: null
          },
          icon: {
            type: new DataTypes.STRING(32),
            allowNull: true,
            defaultValue: null
          },
          header: {
            type: new DataTypes.STRING,
            allowNull: true,
            defaultValue: null
          },
          teaser: {
            type: new DataTypes.STRING,
            allowNull: true,
            defaultValue: null
          }
        },
        {
          tableName: "shop_pages",
          sequelize
        }
    );
}
