const { execSync } = require("child_process");
const { readdirSync, writeFileSync, statSync, existsSync, rmdirSync, mkdirSync, rmSync } = require("fs");
const { platform } = require("os");
const path = require("path");
const { join, resolve, relative } = require("path");

const ROOT = process.cwd();
const SRC_DIR = resolve(ROOT, "src");
const OUT_DIR = resolve(ROOT, "build");

function findProtoFiles(dir) {
    const entries = readdirSync(dir);
    const results = [];

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...findProtoFiles(fullPath));
        } else if (stat.isFile() && fullPath.endsWith(".proto")) {
            results.push(fullPath);
        }
    }

    return results;
}

const protoFiles = findProtoFiles(SRC_DIR);

if (protoFiles.length === 0) {
    console.log("No .proto files found.");
    process.exit(0);
}

if(existsSync(OUT_DIR)) {
    rmSync(OUT_DIR, {
        recursive: true
    });
}

mkdirSync(OUT_DIR);

const relativeProtoFiles = protoFiles.map(file =>
    relative(ROOT, file)
);

const protocPath = path.join("..", "..", "bin", "protoc", "bin", (platform() === "win32")?("protoc.exe"):("protoc"));

for (let i = 0; i < relativeProtoFiles.length; i += 20) {
    const chunk = relativeProtoFiles.slice(i, i + 20);

    const command = [
        protocPath,
        `--plugin=protoc-gen-ts_proto=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd"`,
        `--ts_proto_opt=esModuleInterop=true,importSuffix=.js,outputTypeRegistry=true`,
        `--ts_proto_out=${OUT_DIR}`,
        `-I=src`, // root must prefix the proto paths
        ...chunk.map(f => `"${f}"`)
    ].join(" ");

    execSync(command, { stdio: "inherit" });
}

function findTsFiles(dir) {
    const entries = readdirSync(dir);
    const results = [];

    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            results.push(...findTsFiles(fullPath));
        } else if (
            stat.isFile() &&
            fullPath.endsWith(".ts") &&
            !fullPath.endsWith("index.ts")
        ) {
            results.push(fullPath);
        }
    }

    return results;
}

function generateIndex() {
    const tsFiles = findTsFiles(OUT_DIR);

    const exports = tsFiles.map(file => {
        const relPath = "./" +
            relative(OUT_DIR, file)
                .replace(/\\/g, "/")
                .replace(/\.ts$/, "");

        if (path.basename(file, ".ts") === "typeRegistry") {
            return `export * from "${relPath}";`;
        }

        return `export { ${path.basename(file, ".ts")} } from "${relPath}";`;
    });

    const content =
        "// AUTO-GENERATED FILE - DO NOT EDIT\n\n" +
        exports.join("\n") +
        "\n";

    writeFileSync(join(OUT_DIR, "index.ts"), content);

    console.log("Generated build/index.ts");
}

generateIndex();
