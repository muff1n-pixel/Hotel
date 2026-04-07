import { createReadStream, createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import path from "path";
import { Readable } from "stream";
import unzipper from "unzipper";

export default class SetupAssets {
    public static hasAssets() {
        return existsSync(path.join("..", "..", "assets", "furniture"));
    }

    public static async setup() {
        console.log(`3.a Downloading assets (this may take a while)...`);

        const response = await fetch("http://pixel63.muff1n-pixel.org/game/assets/assets.zip");

        if (!response.ok || !response.body) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const nodeStream = Readable.fromWeb(response.body);

        await new Promise((resolve, reject) => {
            const file = createWriteStream("assets.zip");

            nodeStream.pipe(file);
            
            file.on("finish", resolve);
            file.on("error", reject);
        });

        console.log("3.b Extracting downloaded archive (this may take a while)...");

        mkdirSync(path.join("..", "..", "assets"), { recursive: true });

        await createReadStream("assets.zip")
                .pipe(unzipper.Extract({ path: path.join("..", "..", "assets") }))
                .promise();

        unlinkSync("assets.zip");
    }
}