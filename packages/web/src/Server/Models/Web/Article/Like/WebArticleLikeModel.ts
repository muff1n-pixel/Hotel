import { DataTypes, Model, Sequelize } from "sequelize";
import { UserModel } from "../../../Users/UserModel";
import { WebArticleModel } from "../WebArticleModel";

export class WebArticleLikeModel extends Model {
    declare id: string;
}

export function initialize(sequelize: Sequelize) {
    WebArticleLikeModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
        },
        {
            tableName: 'web_article_likes',
            sequelize
        },
    );
}

export function associate() {
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
