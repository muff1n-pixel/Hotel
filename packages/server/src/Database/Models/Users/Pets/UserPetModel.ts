import { DataTypes, Model, Sequelize } from "sequelize";
import { NonAttribute } from "@sequelize/core";
import { RoomModel } from "../../Rooms/RoomModel.js";
import { UserModel } from "../UserModel.js";
import { RoomPositionData } from "@pixel63/events";
import { PetModel } from "../../Pets/PetModel.js";

export class UserPetModel extends Model {
    declare id: string;
    declare position: RoomPositionData;
    declare direction: number;
    declare name: string;
    declare scratches: number;

    declare level: number;
    declare experience: number;
    declare happiness: number;
    declare energy: number;

    declare room: NonAttribute<RoomModel | null>;
    declare user: NonAttribute<UserModel>;
    declare pet: NonAttribute<PetModel>;

    declare createdAt: NonAttribute<Date>;
}

export function initializeUserPetModel(sequelize: Sequelize) {
    UserPetModel.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            happiness: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            energy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            position: {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("position"));
                },
                set: function (value) {
                    this.setDataValue("position", JSON.stringify(value));
                },
                allowNull: true,
                defaultValue: null
            },
            direction: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            animation: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            color: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            scratches: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        },
        {
            tableName: 'user_pets',
            sequelize
        },
    );

    UserPetModel.belongsTo(PetModel, {
        as: "pet",
        foreignKey: "petId"
    });

    UserPetModel.belongsTo(UserModel, {
        as: "user",
        foreignKey: "userId"
    });

    UserPetModel.belongsTo(RoomModel, {
        as: "room",
        foreignKey: "roomId",
        constraints: false
    });

    RoomModel.hasMany(UserPetModel, {
        as: "roomPets",
        foreignKey: "roomId",
        constraints: false
    });
}
