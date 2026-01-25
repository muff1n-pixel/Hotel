import { Sequelize } from "sequelize";

export const useMemoryDatabase = process.argv.some((value) => value === "memory");
export const resetDatabase = process.argv.some((value) => value === "memory" || value === "reset");

if(resetDatabase && !useMemoryDatabase) {
  rmSync("database.sqlite");
}

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: (useMemoryDatabase)?(":memory:"):("database.sqlite"),
    logging: false
});

import "./Models/Rooms/RoomModel.js";
import { initializeRoomFurnitureModel } from "./Models/Rooms/RoomFurnitureModel.js";
import { initializeRoomModel } from "./Models/Rooms/RoomModel.js";
import { initializeShopPageModel } from "./Models/Shop/ShopPageModel.js";
import { initializeShopPageFurnitureModel } from "./Models/Shop/ShopPageFurnitureModel.js";
import { initializeFurnitureModel } from "./Models/Furniture/FurnitureModel.js";
import { initializeUserFurnitureModel } from "./Models/Users/Furniture/UserFurnitureModel.js";
import { initializeRoomMapModel } from "./Models/Rooms/Maps/RoomMapModel.js";
import { rmSync } from "fs";
import { initializeRoomChatStyleModel } from "./Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import { initializeUserModel } from "./Models/Users/UserModel.js";

export async function initializeModels() {
  initializeFurnitureModel(sequelize);

  initializeShopPageModel(sequelize);
  initializeShopPageFurnitureModel(sequelize);

  initializeRoomMapModel(sequelize);

  initializeUserModel(sequelize);
  
  initializeRoomModel(sequelize);
  initializeRoomFurnitureModel(sequelize);
  initializeRoomChatStyleModel(sequelize);

  initializeUserFurnitureModel(sequelize);

  await sequelize.sync();
}
