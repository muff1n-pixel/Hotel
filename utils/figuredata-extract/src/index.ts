import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import path from "path";
import { createFiguredataData, createFiguremapData } from "./data/DataCreation.ts";

const assetName = process.argv[2];

if(!assetName) {
    throw new Error("Argument is missing for asset name.");
}

if(existsSync(path.join("temp", assetName))) {
    rmSync(path.join("temp", assetName), {
        force: true,
        recursive: true
    });
}

(async () => {
    const outputPath = path.join("..", "..", "assets", "figure");

    if(!existsSync(outputPath)) {
        mkdirSync(outputPath, {
            recursive: true
        });
    }
    
    if(assetName === "figuremap") {
        const data = createFiguremapData();

        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }
    else if(assetName === "figuredata") {
        const data = createFiguredataData();

        writeFileSync(path.join(outputPath, `${assetName}.json`), JSON.stringify(data, undefined, 2), {
            encoding: "utf-8"
        });
    }
})();
