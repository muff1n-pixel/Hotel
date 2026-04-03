import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmdirSync } from "fs";
import path from "path";
import type { FurnitureSound } from "../../../../packages/game/src/Client/Interfaces/Furniture/FurnitureSound.ts"
import { parseFile } from 'music-metadata';

export default class SoundSets {
    public static async extract(assetName: string): Promise<FurnitureSound[] | undefined> {
        const manifest = this.getManifest(assetName);

        if(!manifest) {
            console.error("Manifest does not exist for asset " + assetName);

            return undefined;
        }

        console.debug("Extracting sound sets from " + manifest + " for " + assetName);
        
        const soundFilesFromManifest = this.getSoundFilesFromManifest(manifest);

        if(soundFilesFromManifest.length === 0) {
            return undefined;
        }

        const furnitureOutputPath = path.join("../../assets/furniture/", assetName);

        if(!existsSync(furnitureOutputPath)) {
            console.error("Furniture " + assetName + " does not exist in local assets directory!");

            return undefined;
        }

        const soundOutputPath = path.join(furnitureOutputPath, "sounds");

        if(existsSync(soundOutputPath)) {
            rmdirSync(soundOutputPath);
        }

        mkdirSync(soundOutputPath);

        const result: FurnitureSound[] = [];

        for(const soundFile of soundFilesFromManifest) {
            const soundPath = path.join("sounds", "files", soundFile);

            if(!existsSync(soundPath)) {
                console.error("Sound file " + soundFile + " does not exist in local directory!");

                continue;
            }

            copyFileSync(soundPath, path.join(soundOutputPath, soundFile));

            const metadata = await parseFile(soundPath, {
                duration: true
            });

            result.push({
                index: parseInt(soundFile.substring(0, soundFile.indexOf('.')).split('_').toReversed()[0] ?? "0"),
                duration: Math.round(metadata.format.duration ?? 0),
                file: soundFile
            });
        }

        return result.toSorted((a, b) => a.index - b.index);
    }

    private static getManifest(assetName: string): string | undefined {
        const manifestsPath = path.join("sounds", "manifests");

        const files = readdirSync(manifestsPath, { withFileTypes: true }).filter((file) => file.isFile()).map((file) => file.name);

        return files.find((file) => file.startsWith(assetName));
    }

    private static getSoundFilesFromManifest(manifest: string) {
        const filePath = path.join("sounds", "manifests", manifest);

        const content = readFileSync(filePath, { encoding: "utf-8" });

        const soundFiles: string[] = [];

        for(const line of content.split('\n')) {
            if(line.startsWith("-") && line.endsWith(".mp3")) {
                soundFiles.push(line.substring(line.lastIndexOf('/') + 1));
            }
        }

        return soundFiles;
    }
}