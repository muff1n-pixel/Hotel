import { Application } from "express";
import { readdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

type RouteModule = {
    default?: any;
};

export class ApiManager {

    async init(app: Application, dir: string | null = null): Promise<number> {

        const currentDir = dir ?? path.dirname(fileURLToPath(import.meta.url));

        const modules = await this.scanRoutes(currentDir);

        let count = 0;

        for (const m of modules) {
            if (!m.router || !m.routePath) continue;

            app.use(m.routePath, m.router);
            count++;
        }

        return count;
    }

    async scanRoutes(dir: string): Promise<{
        router: any;
        routePath: string;
    }[]> {

        const entries = await readdir(dir, { withFileTypes: true });

        const modules: {
            router: any;
            routePath: string;
        }[] = [];

        for (const entry of entries) {

            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                modules.push(...await this.scanRoutes(fullPath));
                continue;
            }

            if (entry.name === "ApiManager.ts") continue;

            if (!/\.(ts|js)$/.test(entry.name)) continue;

            try {
                const mod: RouteModule =
                    await import(pathToFileURL(fullPath).href);

                if (!mod.default) continue;

                let routePath = fullPath
                    .replace(path.dirname(fileURLToPath(import.meta.url)), "")
                    .replace(/\\/g, "/")
                    .replace(/\.(ts|js)$/, "")
                    .toLowerCase();

                const parts = routePath.split("/").filter(Boolean);

                if (parts.length >= 2 &&
                    parts.at(-1) === parts.at(-2)) {
                    parts.pop();
                }

                routePath = "/api/" + parts.join("/");

                modules.push({
                    router: mod.default,
                    routePath
                });

            } catch (err) {
                console.error(`Error on API path ${fullPath}`, err);
            }
        }

        return modules;
    }
}