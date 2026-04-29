import NodeSpriteGenerator from "node-sprite-generator";
import { writeFileSync } from "fs";

export function createSpritesheet() {
    // sprite generator is having issues creating the file
    writeFileSync("spritesheet.png", "");

    NodeSpriteGenerator({
        compositor: "jimp",
        src: [
            "./src/Loader/images/*.png",
            "./src/Loader/images/**/*.png",
        ],
        layout: "packed",
        stylesheet: "css",
        spritePath: "@Game/Loader/styles/spritesheet.png",
        stylesheetPath: "@Game/Loader/styles/spritesheet.css",
        stylesheetOptions: {
            nameMapping: ((file: string) => {
                let name = file.split('/').filter((directory) => !(directory === '.' || directory === 'images')).join('_').replace('.png', '').replace('src_Loader_', '');

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
