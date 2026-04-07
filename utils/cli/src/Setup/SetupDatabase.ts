import { confirm, input, number } from "@inquirer/prompts";
import { copyFileSync, existsSync, readdirSync, readFile, readFileSync, writeFileSync } from "fs";
import mysql from "mysql2/promise";
import path from "path";

type DatabaseCredentials = {
    hostname: string;
    port: number;
    username: string;
    password: string;

    database: string;
};

export default class SetupDatabase {
    private static credentials?: DatabaseCredentials;

    public static async hasDatabaseConnection() {
        const configPath = path.join("..", "..", "packages", "server", "config.json");

        if(!existsSync(configPath)) {
            return false;
        }

        const config = JSON.parse(readFileSync(configPath, { encoding: "utf-8" }));

        if(await this.getDatabaseSchema(config.database.host, config.database.port, config.database.username, config.database.password, config.database.database)) {
            return true;
        }

        return false;
    }

    public static async setupDatabaseConnection(): Promise<void> {
        const hostname = await input({
            message: "MySQL Database Hostname:",
            default: "localhost",
            required: true,
        });
        
        const port = await number({
            message: "MySQL Database Port:",
            required: true,
            default: 3306
        });

        const username = await input({
            message: "MySQL Database User:",
            default: "root",
            required: true,
        });

        const password = await input({
            message: "MySQL Database Password:",
            default: "password",
            required: true,
        });

        console.log("");
        console.log("Testing database connection...");

        if(!(await this.getDatabaseConnection(hostname, port, username, password))) {
            console.error("Connection to the database failed! Please try again.");

            return this.setupDatabaseConnection();
        }

        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);

        console.log("Database connection succeeded.");

        console.log("");

        const database = await input({
            message: "MySQL Database Schema:",
            default: "hotel",
            required: true,
        });

        console.log("");

        if((await this.getDatabaseSchema(hostname, port, username, password, database))) {
            const overwrite = await confirm({
                message: `A database schema with the name '${database}' already exists. Do you want to overwrite it?`
            });

            if(!overwrite) {
                return this.setupDatabaseConnection();
            }
        }

        this.credentials = {
            hostname,
            port,

            username,
            password,

            database
        };
    }

    public static async getDatabaseConnection(host: string, port: number, user: string, password: string) {
        try {
            const connection = await mysql.createConnection({
                host,
                port,
                user,
                password
            });

            await connection.end();

            return true;
        }
        catch {
            return false;
        }
    }

    public static async getDatabaseSchema(host: string, port: number, user: string, password: string, database: string) {
        try {
            const connection = await mysql.createConnection({
                host,
                port,
                user,
                password,
                database
            });

            await connection.end();

            return true;
        }
        catch {
            return false;
        }
    }

    private static async createDatabase(credentials: DatabaseCredentials) {
        const connection = await mysql.createConnection({
            host: credentials.hostname,
            port: credentials.port,
            user: credentials.username,
            password: credentials.password
        });

        await connection.execute(`DROP DATABASE IF EXISTS ${credentials.database};`);
        await connection.execute(`CREATE DATABASE ${credentials.database};`);

        await connection.end();
    }

    public static async setupDatabaseSchema() {
        if(!this.credentials) {
            throw new Error("Credentials are not set.");
        }

        await this.createDatabase(this.credentials);
        
        const connection = await mysql.createConnection({
            host: this.credentials.hostname,
            port: this.credentials.port,
            user: this.credentials.username,
            password: this.credentials.password,
            database: this.credentials.database,
            
            multipleStatements: true
        });

        const schemaPath = path.join("..", "..", "packages", "server", "schema");

        const files = readdirSync(schemaPath);

        for(const file of files) {
            const filePath = path.join(schemaPath, file);

            const content = readFileSync(filePath, { encoding: "utf-8" });

            await connection.query(content);
        }

        await connection.end();
    }

    public static saveCredentials() {
        if(!this.credentials) {
            throw new Error("Credentials are not set.");
        }

        const packagePaths = ["server", "web"].map((name) => path.join("..", "..", "packages", name));

        for(const packagePath of packagePaths) {
            const configPath = path.join(packagePath, "config.json");

            if(!existsSync(configPath)) {
                copyFileSync(path.join(packagePath, "config.example.json"), configPath);
            }

            const config = JSON.parse(readFileSync(configPath, { encoding: "utf-8" }));

            config.database.database = this.credentials.database;
            config.database.port = this.credentials.port;
            config.database.username = this.credentials.username;
            config.database.password = this.credentials.password;
            config.database.hostname = this.credentials.hostname;

            writeFileSync(configPath, JSON.stringify(config, undefined, 4));
        }
    }
}
