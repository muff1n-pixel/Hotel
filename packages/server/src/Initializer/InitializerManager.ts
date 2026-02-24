import Inquirer from 'inquirer';
import fs from 'fs';
import request from 'request';
import { config } from '../Config/Config';
import { sendLog } from '../Logger/Logger';
import { IncomingMessage } from "http";
import cliProgress from 'cli-progress';
import { initializeModels } from '../Database/Database';
import { initializeDevelopmentData } from '../Database/Development/DatabaseDevelopmentData';
import { startServer } from '..';
import StreamZip from 'node-stream-zip';

export default class InitializerManager {
    progressCount: number;
    progressBar: cliProgress.SingleBar;

    constructor() {
        this.progressCount = 0;
        this.progressBar = new cliProgress.SingleBar({
            format: 'Progress {bar}| {percentage}% || {value}/{total} Chunks',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.shades_classic);
    }

    public init(): void {
        this.setSelectOptions();
    }

    private setSelectOptions(): void {
        Inquirer.prompt([
            {
                type: 'rawlist',
                message: "Select an option",
                name: 'option',
                choices: [
                    'Download and extract assets',
                    'Setup database',
                    'Insert default values in database',
                    'Start server',
                ]
            }
        ])
            .then(({ option }) => {
                switch (option) {
                    case 'Download and extract assets': {
                        this.downloadAndExtractAssets();
                        break;
                    }

                    case 'Setup database': {
                        this.setupDatabase();
                        break;
                    }

                    case 'Insert default values in database': {
                        this.insertDefaultValues();
                        break;
                    }

                    case 'Start server': {
                        this.startServer();
                        break;
                    }

                    default:
                        break;
                }
            });
    }

    private startServer(): void {
        startServer();
    }

    private async setupDatabase(): Promise<any> {
        try {
            await initializeModels();
            sendLog("SUCCESS", "Database setup completed successfully.");
            this.setSelectOptions();
        }
        catch (e: any) {
            sendLog("ERROR", "An error occurred while setting up the database: " + e.toString());
            this.setSelectOptions();
            return;
        }
    }

    private async insertDefaultValues(): Promise<any> {
        try {
            await initializeDevelopmentData();
            sendLog("SUCCESS", "Default values inserted successfully.");
            this.setSelectOptions();
        }
        catch (e: any) {
            sendLog("ERROR", "An error occurred while inserting default values: " + e.toString());
            this.setSelectOptions();
            return;
        }
    }

    private async downloadAndExtractAssets(): Promise<any> {
        const instance = this;

        if (config.assetsFolder === null || !fs.existsSync(config.assetsFolder)) {
            sendLog("ERROR", "Your assets folder path (config.json) is invalid.");
            this.setSelectOptions();
            return;
        }

        let receivedBytes = 0,
            totalBytes = 0;

        const out = fs.createWriteStream(config.assetsFolder + "/assets.zip");
        const req = request({
            method: 'GET',
            uri: config.assetsDownloaderUrl
        });

        sendLog("INFO", "Start downloading...");

        req.on('error', function (err: any) {
            sendLog("ERROR", "An error occurred while downloading the assets: " + err.message);
            instance.resetProgressBar();
            instance.setSelectOptions();
            return;
        });

        req.on('data', function (chunk: Buffer) {
            receivedBytes += chunk.length;
            instance.showDownloadingProgress(receivedBytes, totalBytes);
        });

        req.on('response', function (res: IncomingMessage) {
            totalBytes = parseInt(res.headers['content-length'] as string);
        });

        req.on('end', function () {
            instance.resetProgressBar();
            instance.unzipAssets();
        });

        req.pipe(out);
    }

    resetProgressBar(): void {
        this.progressCount = 0;
        this.progressBar.stop();
    }

    showDownloadingProgress(received: number, total: number): void {
        if (this.progressCount === 0) {
            this.progressBar.start(total, received);
        } else {
            this.progressBar.update(received);
        }

        this.progressCount += received;
    }

    private async unzipAssets(): Promise<void> {
        try {
            const zip = new StreamZip.async({ file: config.assetsFolder + "/assets.zip" });
            const entriesCount = await zip.entriesCount;
            const showProgress = (counter: number) => {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`\x1b[44m INFO \x1b[0m Unzipping assets (${Math.floor(counter / entriesCount * 100)}%)...`);
            }

            let count = 0;

            zip.on('extract', () => {
                count++;
                showProgress(count);
            });

            await zip.extract(null, config.assetsFolder);
            showProgress(entriesCount);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            sendLog("SUCCESS", `${count} assets unzipped successfully.`);
            fs.unlinkSync(config.assetsFolder + "/assets.zip");
            this.setSelectOptions();
        } catch (err) {
            sendLog("ERROR", "An error occurred while unzipping the assets: " + (err as Error).message);
            this.setSelectOptions();
        }
    }
}