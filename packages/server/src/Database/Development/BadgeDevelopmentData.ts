import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import ini from "ini";

export function getBadgeDatas(filter: (assetName: string) => boolean = () => true) {
    const externalFlashTexts = ini.parse(readFileSync("../../utils/swf-extract/external_flash_texts.ini", { encoding: "utf-8" }));

    const assetNames = readdirSync(path.join("..", "..", "assets", "badges"), { withFileTypes: true })
        .filter((directory) => directory.isFile())
        .map((directory) => path.basename(directory.name, ".gif"))
        .filter(filter);

    return assetNames.map((assetName) => {
        return {
            id: assetName,
            image: assetName + ".gif",
            name: externalFlashTexts[`${assetName}_badge_name`],
            description: externalFlashTexts[`${assetName}_badge_desc`]
        };
    })
}
