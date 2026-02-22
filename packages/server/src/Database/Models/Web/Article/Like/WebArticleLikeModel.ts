import { DataTypes, Model, Sequelize } from "sequelize";
import { WebArticleModel } from "../WebArticleModel.js";
import { UserModel } from "../../../Users/UserModel.js";

export class WebArticleLikeModel extends Model {
    declare id: string;
}

export function initializeWebArticleLikeModel(sequelize: Sequelize) {
    WebArticleLikeModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            }
        },
        {
            tableName: 'web_article_likes',
            sequelize
        },
    );

    WebArticleLikeModel.belongsTo(WebArticleModel, {
        as: "article",
        foreignKey: "articleId",
        constraints: false
    });

    WebArticleLikeModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId",
        constraints: false
    });
}
