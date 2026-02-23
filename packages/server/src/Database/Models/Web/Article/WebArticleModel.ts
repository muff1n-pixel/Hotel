import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../../Users/UserModel";

export class WebArticleModel extends Model {
    declare id: string;
    declare bannerUrl: string;
    declare title: string;
    declare content: string;
    
    declare author: NonAttribute<UserModel>;
}

export function initializeWebArticleModel(sequelize: Sequelize) {
    WebArticleModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            bannerUrl: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            }
        },
        {
            tableName: 'web_articles',
            sequelize
        },
    );
    
    WebArticleModel.belongsTo(UserModel, {
        as: "author",
        foreignKey: "authorId",
        constraints: false
    });
}
