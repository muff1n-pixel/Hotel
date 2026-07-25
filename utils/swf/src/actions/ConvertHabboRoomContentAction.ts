import { confirm, input, select } from "@inquirer/prompts";
import { PromisePool } from "@supercharge/promise-pool";
import { readdirSync } from "fs";
import path from "path";
import FurnitureExtraction from "../extractions/FurnitureExtraction.ts";
import HabboRoomContentExtraction from "../extractions/HabboRoomContentExtraction.ts";

export default class ConvertHabboRoomContentAction {
    public async run() {
        const assetName = "HabboRoomContent";

        console.time("> Extracting " + assetName);

        const extraction = new HabboRoomContentExtraction(assetName);

        await extraction.execute();
        
        console.timeEnd("> Extracting " + assetName);
    }
}
