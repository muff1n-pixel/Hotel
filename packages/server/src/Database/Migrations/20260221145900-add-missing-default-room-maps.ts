import { PermissionAction } from "@shared/Interfaces/Permissions/PermissionMap";
import { QueryInterface, Op } from "sequelize";
import type { Migration } from "sequelize-cli";

const models = ["model_0", "model_1", "model_2", "model_3", "model_4", "model_5", "model_6", "model_7", "model_8", "model_9"];

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            for(const model of models) {
                await queryInterface.bulkUpdate("room_models", {
                    indexable: true,
                    index: 25 + models.indexOf(model)
                }, {
                    id: model
                }, {
                    transaction
                });
            }
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            for(const model of models) {
                await queryInterface.bulkUpdate("room_models", {
                    indexable: false,
                    index: 0
                }, {
                    id: model
                }, {
                    transaction
                });
            }
        }
    )
} satisfies Migration;
