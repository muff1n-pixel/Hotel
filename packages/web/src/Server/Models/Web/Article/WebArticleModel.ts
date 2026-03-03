import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../../Users/UserModel.js";

export class WebArticleModel extends Model {
    declare id: string;
    declare bannerUrl: string;
    declare title: string;
    declare content: string;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare authorId: NonAttribute<UserModel>;
}

export function initialize(sequelize: Sequelize) {
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
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: Date.now()
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: Date.now()
            }
        },
        {
            tableName: 'web_articles',
            sequelize
        },
    );
}

export function associate() {
    WebArticleModel.belongsTo(UserModel, {
        as: "author",
        foreignKey: "authorId",
        constraints: false
    });
}