import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { WebHomeItemModel } from "../Item/WebHomeItemModel";
import { UserModel } from "../../../Users/UserModel";

export class WebHomeUserItemModel extends Model {
    declare id: string;
    declare positionX: number | null;
    declare positionY: number | null;
    declare data: string | null;
    declare borderSkin: string | null;

    declare item: NonAttribute<WebHomeItemModel>;
    declare user: NonAttribute<UserModel>;
}

export function initialize(sequelize: Sequelize) {
    WebHomeUserItemModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            positionX: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            positionY: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            data: {
                type: DataTypes.STRING(500),
                allowNull: true,
                defaultValue: null
            },
            borderSkin: {
                type: DataTypes.ENUM({
                    values: ['none', 'default', 'golden', 'metal', 'notepad', 'speech_bubble', 'stickie_note', 'hc_bling', 'hc_scifi']
                }),
                allowNull: true,
                defaultValue: null
            },
        },
        {
            tableName: "web_home_user_items",
            sequelize
        }
    );
}

export function associate() {
    WebHomeUserItemModel.belongsTo(WebHomeItemModel, {
        as: "item",
        foreignKey: "itemId"
    });

    WebHomeUserItemModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}