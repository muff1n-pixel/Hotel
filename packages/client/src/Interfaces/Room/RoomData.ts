import { FurnitureAssets } from "../Furniture/FurnitureAssets";
import { FurnitureIndex } from "../Furniture/FurnitureIndex";
import { FurnitureLogic } from "../Furniture/FurnitureLogic";
import { FurnitureSprites } from "../Furniture/FurnitureSprites";
import { FurnitureVisualization } from "../Furniture/FurnitureVisualization";
import { RoomVisualization } from "./RoomVisualization";

export type RoomData = {
    index: FurnitureIndex;
    visualization: RoomVisualization;
    assets: FurnitureAssets;
    sprites: FurnitureSprites;
};
