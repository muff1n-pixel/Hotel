'use strict';

import { Op } from "sequelize";
import { getExistingFurnitureAssets } from "../build/Database/Development/FurnitureDevelopmentData.js";
import { randomUUID } from "node:crypto";

const assetNames = ["dimmer_buttn", "dimmer_swtch", "dimmer_fuse2", "dimmer_fuse6"];

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {    
    const furnitureDatas = await getExistingFurnitureAssets((assetName) => assetNames.includes(assetName));

    await queryInterface.bulkInsert("furnitures", furnitureDatas.flatMap((furnitures) => furnitures).map((furniture) => {
        return {
            id: randomUUID(),
            type: furniture.type,

            name: furniture.name,
            description: furniture.description,

            flags: JSON.stringify(furniture.flags),

            color: furniture.color ?? null,
            placement: furniture.placement,
            dimensions: JSON.stringify(furniture.dimensions),

            category: furniture.category,
            interactionType: furniture.interactionType,

            createdAt: new Date(),
            updatedAt: new Date()
        };
    }));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("furnitures", {
      type: {
        [Op.in]: assetNames
      }
    }, {});
  }
};
