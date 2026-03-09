import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { WebArticleModel } from "../WebArticleModel.js";
import { UserModel } from "../../../Users/UserModel.js";
import { WebArticleCommentModel } from "../Comment/WebArticleCommentModel.js";

export class WebArticleLikeModel extends Model {
    declare id: string;
    declare articleId: string;
    declare commentId: string;
    declare userId: string;

    declare comment: NonAttribute<WebArticleCommentModel>;
    declare article: NonAttribute<WebArticleModel>;
    declare user: NonAttribute<UserModel>;
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

    WebArticleLikeModel.belongsTo(WebArticleCommentModel, {
        as: "comment",
        foreignKey: "commentId",
        constraints: false
    });

    WebArticleLikeModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId",
        constraints: false
    });
}
