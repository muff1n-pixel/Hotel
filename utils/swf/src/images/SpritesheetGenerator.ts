import TexturePacker from "free-tex-packer-core";
import { readFileSync } from "node:fs";
import path from "node:path";
import { downscaleIfNeeded } from "./Downscaling.ts";

export default class SpritesheetGenerator {
    private readonly imagePaths: string[];

    constructor(imagePaths: string[]) {
        this.imagePaths = imagePaths;
    }

    public async execute() {
        await this.generateDownscaledSprites();

        const { imageBuffer, spritesBuffer } = await this.generateSpritesheet();

        const sprites = JSON.parse(new TextDecoder().decode(spritesBuffer));

        return {
            imageBuffer,
            sprites: Object.entries(sprites.frames).map(([name, data]: any) => ({
                name: path.basename(name, path.extname(name)),
                x: data.frame.x,
                y: data.frame.y,
                height: data.frame.h,
                width: data.frame.w
            }))
        };
    }

    private async generateDownscaledSprites() {
        if(process.env.AUTOMATICALLY_DOWNSCALE_SPRITES) {
            this.imagePaths.push(...(await Promise.all(
                this.imagePaths.map(async (imagePath) => {
                    return await downscaleIfNeeded(imagePath);
                })))
            );
        }
    }

    private async generateSpritesheet() {
        const files = await TexturePacker.packAsync(this.imagePaths.map((imagePath) => {
            return {
                path: path.basename(imagePath, ".png"),
                contents: readFileSync(imagePath)
            };
        }), {
            textureName: "spritesheet",
            allowRotation: false,
            allowTrim: false
        });

        const image = files.find((file) => file.name.endsWith(".png"));

        if(!image) {
            throw new Error("Image spritesheet was not generated.");
        }

        const sprites = files.find((file) => file.name.endsWith(".json"));

        if(!sprites) {
            throw new Error("Sprites data was not generated.");
        }

        return {
            imageBuffer: image.buffer,
            spritesBuffer: sprites.buffer
        };
    }
}