import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { Sequelize } from 'sequelize';

type ModelModule = {
    initialize?: (sequelize: Sequelize) => Promise<void> | void;
    associate?: () => Promise<void> | void;
};

export class ModelManager {
    async init(sequelizeInstance: Sequelize, dir: string | null = null): Promise<number> {

        const currentDir =
            dir ?? path.dirname(fileURLToPath(import.meta.url));

        const modules = await this.scanModels(currentDir);

        let count = 0;

        for (const m of modules) {
            if (typeof m.initialize === "function") {
                await m.initialize(sequelizeInstance);
                count++;
            }
        }

        for (const m of modules) {
            if (typeof m.associate === "function") {
                await m.associate();
            }
        }

        return count;
    }

    async scanModels(dir: string): Promise<ModelModule[]> {
        const entries = await readdir(dir, { withFileTypes: true });

        const modules: ModelModule[] = [];

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                modules.push(...await this.scanModels(fullPath));
                continue;
            }

            if (!entry.name.endsWith(".ts")) continue;

            try {
                const mod = await import(pathToFileURL(fullPath).href);

                if (mod.initialize || mod.associate) {
                    modules.push(mod);
                }

            } catch (err) {
                console.error(`Error on Model path ${fullPath}`, err);
            }
        }

        return modules;
    }
}