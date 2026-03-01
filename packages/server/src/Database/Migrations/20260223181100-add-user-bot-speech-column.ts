import { BotSpeechData } from '@pixel63/events';
import { QueryInterface, DataTypes } from 'sequelize';
import type { Migration } from "sequelize-cli";

export default {
    up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.addColumn("user_bots", "speech", {
                type: DataTypes.TEXT,
                get: function () {
                    return JSON.parse(this.getDataValue("speech"));
                },
                set: function (value) {
                    this.setDataValue("speech", JSON.stringify(value));
                },
                allowNull: false,
                defaultValue: JSON.stringify(BotSpeechData.create({
                    automaticChat: false,
                    automaticChatDelay: 30,
                    messages: [],
                    randomizeMessages: true
                }))
            }, {
                transaction
            });

            await queryInterface.bulkUpdate("user_bots", {
                speech: JSON.stringify(BotSpeechData.create({
                    automaticChat: false,
                    automaticChatDelay: 30,
                    messages: [],
                    randomizeMessages: true
                }))
            }, {}, { transaction });
        }
    ),

    down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
        async (transaction) => {
            await queryInterface.removeColumn("user_bots", "speech", { transaction });
        }
    )
} satisfies Migration;
