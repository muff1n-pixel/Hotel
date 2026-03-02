import type { Options } from "sequelize";

export type Config = {
    port: number;
    hostname?: string;

    database: Options;

    assets: string;
    static: string;

    public: {
        server: {
            secure: boolean;
            hostname: string;
            port: number;
        };

        discord: string | null;
    };

    users: {
        defaultHomeRoomId: string | null;
    }
};
