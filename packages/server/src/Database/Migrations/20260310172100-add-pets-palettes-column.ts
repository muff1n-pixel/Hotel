import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("pets", "palettes", {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("palettes"));
                },
                set: function (value) {
                    this.setDataValue("palettes", JSON.stringify(value));
                },
                allowNull: true,
                defaultValue: null
            }, {
                transaction
            });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("pets", "palettes", { transaction });
        }
    )
} satisfies Migration;
