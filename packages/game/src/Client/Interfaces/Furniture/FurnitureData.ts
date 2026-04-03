import { FurniturePalette } from "@Client/Interfaces/Furniture/FurniturePalette";
import { FurnitureAssets } from "./FurnitureAssets";
import { FurnitureIndex } from "./FurnitureIndex";
import { FurnitureLogic } from "./FurnitureLogic";
import { FurnitureSprites } from "./FurnitureSprites";
import { FurnitureVisualization } from "./FurnitureVisualization";
import { FurnitureCustomParts } from "@Client/Interfaces/Furniture/FurnitureCustomParts";
import { FurnitureSound } from "@Client/Interfaces/Furniture/FurnitureSound";

export type FurnitureData = {
    index: FurnitureIndex;
    logic: FurnitureLogic;
    visualization: FurnitureVisualization;
    assets: FurnitureAssets;
    sprites: FurnitureSprites;
    palettes?: FurniturePalette[];
    customParts?: FurnitureCustomParts[];
    sounds?: FurnitureSound[] | undefined;
};
