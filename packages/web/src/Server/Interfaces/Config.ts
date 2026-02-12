import type { Options } from "sequelize";

export type Config = {
    port: number;

    database: Options;

    assets: string;
    static: string;

    public: {
        server: {
            secure: boolean;
            hostname: string;
            port: number;
        }
    }
};
