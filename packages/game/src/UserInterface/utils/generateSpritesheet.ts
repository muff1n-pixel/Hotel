import NodeSpriteGenerator from "node-sprite-generator";
import { writeFileSync } from "fs";

export function createSpritesheet() {
    // sprite generator is having issues creating the file
    writeFileSync("spritesheet.png", "");

    NodeSpriteGenerator({
        compositor: "jimp",
        src: [
            "./src/UserInterface/images/*.png",
            "./src/UserInterface/images/**/*.png",
        ],
        layout: "packed",
        stylesheet: "css",
        spritePath: "@UserInterface/styles/spritesheet.png",
        stylesheetPath: "@UserInterface/styles/spritesheet.css",
        stylesheetOptions: {
            nameMapping: ((file: string) => {
                let name = file.split('/').filter((directory) => !(directory === '.' || directory === 'images')).join('_').replace('.png', '').replace('src_UserInterface_', '');

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
