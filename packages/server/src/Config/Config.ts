import { readFileSync } from "fs";
import { Options, Sequelize } from "sequelize";

export type Config = {
    port?: number;
    
    authentication: {
        useAccessTokens: boolean;
    };
    
    assets: {
        externalUrl: string;
        path: string;
    };

    database: Options;
};

export const config: Config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" })) satisfies Config;

export default {
    development: config.database
};
