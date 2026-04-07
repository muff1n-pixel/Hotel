import fs, { existsSync } from "fs";
import os from "os";
import path from "path";
import unzipper from "unzipper";
import { Readable } from "stream";

const VERSION = "25.3";

export default class SetupProtoc {
    public static readonly binaryPath = path.join("..", "..", "bin", "protoc");

    public static hasProtocBinary() {
        return existsSync(this.binaryPath);
    }

    public static getPlatform() {
        const platform = os.platform();
        const architecture = os.arch();

        switch(platform) {
            case "win32":
                return "win64";

            case "darwin":
                return (architecture === "arm64")?("osx-aarch_64"):("osx-x86_64");

            case "linux":
                return "linux-x86_64";

            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    public static async setup() {
        const platform = this.getPlatform();

        const fileName = `protoc-${VERSION}-${platform}.zip`;

        const downloadPath = path.join(fileName);

        console.log(`Downloading protoc ${VERSION} (${platform})...`);

        const response = await fetch(`https://github.com/protocolbuffers/protobuf/releases/download/v${VERSION}/${fileName}`)

        if (!response.ok || !response.body) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        const nodeStream = Readable.fromWeb(response.body);

        await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(downloadPath);

            nodeStream.pipe(file);
            
            file.on("finish", resolve);
            file.on("error", reject);
        });

        console.log("Download finish, extracting...");

        fs.mkdirSync(this.binaryPath, { recursive: true });

        await fs.createReadStream(downloadPath)
                .pipe(unzipper.Extract({ path: this.binaryPath }))
                .promise();

        fs.unlinkSync(downloadPath);
    }
}
