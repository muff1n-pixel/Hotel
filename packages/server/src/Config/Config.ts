import { readFileSync } from "fs";
import { Options, Sequelize } from "sequelize";

export type Config = {
    port?: number;
    hostname?: string;
    
    authentication: {
        useAccessTokens: boolean;
    };
    
    assets: {
        externalUrl: string;
        path: string;
    };

    database: Options;

    workers?: {
        maximumRoomThreads?: number;
    };
};

export const config: Config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" })) satisfies Config;

export const development = config.database;
