import NodeSpriteGenerator from "node-sprite-generator";
import { writeFileSync } from "fs";
import path from "path";

export function createSpritesheet() {
    // sprite generator is having issues creating the file
    writeFileSync("spritesheet.png", "");

    NodeSpriteGenerator({
        compositor: "jimp",
        src: [
            "./images/*.png",
            "./images/**/*.png",
        ],
        layout: "packed",
        stylesheet: "css",
        spritePath: "src/styles/spritesheet.png",
        stylesheetPath: "src/styles/spritesheet.css",
        stylesheetOptions: {
            nameMapping: ((file: string) => {
                let name = file.split('/').filter((directory) => !(directory === '.' || directory === 'images')).join('_').replace('.png', '');

                if(name.endsWith("_hover")) {
                    name = name.substring(0, name.length - "_hover".length) + ":hover";
                }
                else if(name.endsWith("_active")) {
                    name = name.substring(0, name.length - "_active".length) + ":active";
                }

                return `sprite_${name}`;
            }) as any
        }
    }, function (error) {
        if(error) {
            throw new Error(error.message);
        }
    });
}

createSpritesheet();
