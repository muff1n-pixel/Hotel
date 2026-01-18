import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
});

import "./Models/Rooms/RoomModel.js";
import { initializeRoomFurnitureModel } from "./Models/Rooms/RoomFurnitureModel.js";
import { initializeRoomModel } from "./Models/Rooms/RoomModel.js";
import { initializeShopPageModel } from "./Models/Shop/ShopPageModel.js";
import { initializeShopPageFurnitureModel } from "./Models/Shop/ShopPageFurnitureModel.js";
import { initializeFurnitureModel } from "./Models/Furniture/FurnitureModel.js";
import { initializeUserFurnitureModel } from "./Models/Users/Furniture/UserFurnitureModel.js";

export async function initializeModels() {
  initializeFurnitureModel(sequelize);

  initializeShopPageModel(sequelize);
  initializeShopPageFurnitureModel(sequelize);

  initializeRoomModel(sequelize);
  initializeRoomFurnitureModel(sequelize);

  initializeUserFurnitureModel(sequelize);

  await sequelize.sync();
}
