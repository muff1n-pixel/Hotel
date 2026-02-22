import { DataTypes, Model, Sequelize } from "sequelize";

export class WebArticleModel extends Model {
    declare id: string;
    declare bannerUrl: string;
    declare title: string;
    declare content: string;
    declare author: string;
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
            },
            author: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            tableName: 'web_articles',
            sequelize
        },
    );
}
