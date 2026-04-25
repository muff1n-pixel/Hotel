import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("furnitures", "animations", {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("animations"));
                },
                set: function (value) {
                    this.setDataValue("animations", JSON.stringify(value));
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

                const visualization = data.visualization.visualizations.find((visualization: any) => visualization.size === 64);

                if(!visualization) {
                    continue;
                }

                if(!visualization.animations.length) {
                    console.log("Skipping " + assetName + " due to missing animations");

                    continue;
                }

                const animations: number[] = visualization.animations.map((animation: any) => animation.id).sort();

                await queryInterface.bulkUpdate("furnitures", {
                    animations: JSON.stringify(animations)
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
