import { Sequelize } from "sequelize";
import { MySqlDialect } from "@sequelize/mysql";

export const recreateShop = process.argv.some((value) => value === "shop");
export const resetDatabase = process.argv.some((value) => value === "memory" || value === "reset");
export const debugTimestamps = process.argv.some((value) => value === "debug");

export const config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" }));

export const sequelize = new Sequelize(config.database);

import "./Models/Rooms/RoomModel.js";
import { initializeUserFurnitureModel } from "./Models/Users/Furniture/UserFurnitureModel.js";
import { initializeRoomModel } from "./Models/Rooms/RoomModel.js";
import { initializeShopPageModel } from "./Models/Shop/ShopPageModel.js";
import { initializeShopPageFurnitureModel } from "./Models/Shop/ShopPageFurnitureModel.js";
import { initializeFurnitureModel } from "./Models/Furniture/FurnitureModel.js";
import { initializeRoomMapModel } from "./Models/Rooms/Maps/RoomMapModel.js";
import { readFileSync, rmSync } from "fs";
import { initializeRoomChatStyleModel } from "./Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import { initializeUserModel } from "./Models/Users/UserModel.js";
import { initializeRoomRightsModel } from "./Models/Rooms/Rights/RoomRightsModel.js";
import { initializeHotelFeedbackModel } from "./Models/Hotel/HotelFeedbackModel.js";

export async function initializeModels() {
  initializeFurnitureModel(sequelize);

  initializeShopPageModel(sequelize);
  initializeShopPageFurnitureModel(sequelize);

  initializeRoomMapModel(sequelize);

  initializeUserModel(sequelize);
  
  initializeRoomModel(sequelize);
  initializeRoomRightsModel(sequelize);

  initializeUserFurnitureModel(sequelize);
  initializeRoomChatStyleModel(sequelize);

  initializeHotelFeedbackModel(sequelize);

  await sequelize.sync();
}
