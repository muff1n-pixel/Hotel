import { DataTypes, Model, Sequelize } from "sequelize";

export class WebHomeItemModel extends Model {
    declare id: string;
    declare title: string;
    declare description?: string;
    declare type: string;
    declare image: string | null;
    declare width: number;
    declare height: number;
}

export function initialize(sequelize: Sequelize) {
    WebHomeItemModel.init(
        {
            id: {
                type: DataTypes.STRING(500),
                primaryKey: true
            },
            title: {
                type: new DataTypes.STRING(50),
                allowNull: false
            },
            description: {
                type: new DataTypes.STRING(512),
                allowNull: true,
                defaultValue: null
            },
            type: {
                type: DataTypes.ENUM({
                    values: ['widgets', 'backgrounds', 'stickers', 'notes']
                }),
                allowNull: false
            },
            image: {
                type: new DataTypes.STRING(512),
                allowNull: false
            },
            width: {
                type: new DataTypes.INTEGER,
                allowNull: false
            },
            height: {
                type: new DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "web_home_items",
            sequelize
        }
    );
}
