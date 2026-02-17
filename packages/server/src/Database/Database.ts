import { Sequelize } from "sequelize";

export const recreateShop = process.argv.some((value) => value === "shop");
export const resetDatabase = process.argv.some((value) => value === "memory" || value === "reset");
export const debugTimestamps = process.argv.some((value) => value === "debug");

import "./Models/Rooms/RoomModel.js";
import { initializeUserFurnitureModel } from "./Models/Users/Furniture/UserFurnitureModel.js";
import { initializeRoomModel } from "./Models/Rooms/RoomModel.js";
import { initializeShopPageModel } from "./Models/Shop/ShopPageModel.js";
import { initializeShopPageFurnitureModel } from "./Models/Shop/ShopPageFurnitureModel.js";
import { initializeFurnitureModel } from "./Models/Furniture/FurnitureModel.js";
import { initializeRoomMapModel } from "./Models/Rooms/Maps/RoomMapModel.js";
import { initializeRoomChatStyleModel } from "./Models/Rooms/Chat/Styles/RoomChatStyleModel.js";
import { initializeUserModel } from "./Models/Users/UserModel.js";
import { initializeRoomRightsModel } from "./Models/Rooms/Rights/RoomRightsModel.js";
import { initializeHotelFeedbackModel } from "./Models/Hotel/HotelFeedbackModel.js";
import { config } from "../Config/Config.js";
import { initializeUserTokenModel } from "./Models/Users/UserTokens/UserTokenModel.js";
import { initializeRoomCategoryModel } from "./Models/Rooms/Categories/RoomCategoryModel.js";
import { initializeUserBadgeModel } from "./Models/Users/Badges/UserBadgeModel.js";
import { initializeBadgeModel } from "./Models/Badges/BadgeModel.js";
import { intitializePermissionModel } from "./Models/Permissions/PermissionModel.js";
import { intitializePermissionRoleModel } from "./Models/Permissions/PermissionRoleModel.js";

export const sequelize = new Sequelize(config.database);

export async function initializeModels() {
  initializeBadgeModel(sequelize);
  
  initializeFurnitureModel(sequelize);

  initializeShopPageModel(sequelize);
  initializeShopPageFurnitureModel(sequelize);

  initializeRoomMapModel(sequelize);
  initializeRoomCategoryModel(sequelize);

  initializeUserModel(sequelize);
  initializeUserTokenModel(sequelize);
  initializeUserBadgeModel(sequelize);
  
  initializeRoomModel(sequelize);
  initializeRoomRightsModel(sequelize);

  initializeUserFurnitureModel(sequelize);
  initializeRoomChatStyleModel(sequelize);

  initializeHotelFeedbackModel(sequelize);

  intitializePermissionModel(sequelize);
  intitializePermissionRoleModel(sequelize);

  await sequelize.sync();
}
