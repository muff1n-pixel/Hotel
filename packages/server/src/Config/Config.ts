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
};

export const config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" })) satisfies Config;

module.exports = {
    development: config.database,
    config
};
