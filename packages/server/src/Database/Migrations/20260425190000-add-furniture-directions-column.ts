import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("furnitures", "directions", {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("directions"));
                },
                set: function (value) {
                    this.setDataValue("directions", JSON.stringify(value));
                },
                allowNull: false,
                defaultValue: JSON.stringify([]),
            }, {
                transaction
            });

            const assetNames = readdirSync(join("..", "..", "assets", "furniture"), { withFileTypes: true })
                .filter((directory) => directory.isDirectory())
                .map((directory) => directory.name);

            for(const assetName of assetNames) {
                const fileName = join("..", "..", "assets", "furniture", assetName, `${assetName}.json`);

                if(!existsSync(fileName)) {
                    continue;
                }

                const content = readFileSync(fileName, {
                    encoding: "utf-8"
                });

                const data = JSON.parse(content);

                if(!data.logic.model.directions) {
                    console.log("Skipping " + assetName + " due to missing directions");

                    continue;
                }

                const directions: number[] = data.logic.model.directions.map((direction: any) => direction.id / 45).sort();

                await queryInterface.bulkUpdate("furnitures", {
                    directions: JSON.stringify(directions)
                }, {
                    type: assetName
                }, {
                    transaction
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("furnitures", "directions", { transaction });
        }
    )
} satisfies Migration;
