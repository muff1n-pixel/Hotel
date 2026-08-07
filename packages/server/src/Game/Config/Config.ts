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

    shop: {
        features: {
            path: string;
        };
    };

    camera: {
        path: string;
    };

    database: Options;

    rooms: {
        allocatedRoomServers: {
            local: {
                host: string;
                port: number;
                secure: boolean;
            };

            public: {
                host: string;
                port: number;
                secure: boolean;
            };
        }[];
        
        automaticallySpawnRoomServers: boolean;
        automaticRoomServerPortAllocations: {
            host: string;
            port: number;
        }[];
    };
};

export const config: Config = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" })) as Config;

module.exports = {
    development: config.database,
    config
};
