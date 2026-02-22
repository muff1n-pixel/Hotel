import { DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../../../Users/UserModel";
import { WebArticleModel } from "../WebArticleModel";

export class WebArticleCommentModel extends Model {
    declare id: string;
    declare content: string;
    declare author: string;
}

export function initializeWebArticleCommentModel(sequelize: Sequelize) {
    WebArticleCommentModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            author: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            tableName: 'web_article_comments',
            sequelize
        },
    );

    WebArticleCommentModel.belongsTo(WebArticleModel, {
        as: "article",
        foreignKey: "articleId",
        constraints: false
    });

    WebArticleCommentModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId",
        constraints: false
    });
}
