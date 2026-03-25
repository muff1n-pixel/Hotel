import { DataTypes, Model, NonAttribute, Sequelize } from "sequelize";
import { UserModel } from "../../../Users/UserModel";

export class WebHomeGuestBookMessage extends Model {
    declare id: string;
    declare message: string;
    declare createdAt: Date;

    declare user: NonAttribute<UserModel>;
}

export function initialize(sequelize: Sequelize) {
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
}

export function associate() {
    WebHomeGuestBookMessage.belongsTo(UserModel, {
        as: "userHome",
        foreignKey: "homeId"
    });

    WebHomeGuestBookMessage.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });
}