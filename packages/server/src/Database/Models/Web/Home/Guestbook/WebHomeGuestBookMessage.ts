import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../../../Users/UserModel";

export class WebHomeGuestBookMessage extends Model {
    declare id: string;
    declare message: string;

    declare user: NonAttribute<UserModel>;
    declare userHome: NonAttribute<UserModel>;
}

export function initializeWebHomeGuestBookMessage(sequelize: Sequelize) {
    WebHomeGuestBookMessage.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true
            },
            message: {
                type: DataTypes.STRING(200),
                allowNull: false
            }
        },
        {
            tableName: "web_home_guestbook_messages",
            sequelize
        }
    );

    WebHomeGuestBookMessage.belongsTo(UserModel, {
        as: "userHome",
        foreignKey: "homeId"
    });

    WebHomeGuestBookMessage.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}