import { FurnitureAssets } from "./FurnitureAssets";
import { FurnitureIndex } from "./FurnitureIndex";
import { FurnitureLogic } from "./FurnitureLogic";
import { FurnitureSprites } from "./FurnitureSprites";
import { FurnitureVisualization } from "./FurnitureVisualization";

export type FurnitureData = {
    index: FurnitureIndex;
    logic: FurnitureLogic;
    visualization: FurnitureVisualization;
    assets: FurnitureAssets;
    sprites: FurnitureSprites;
};
