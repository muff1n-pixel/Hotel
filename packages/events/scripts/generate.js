const { execSync } = require("child_process");
const { readdirSync, writeFileSync, statSync } = require("fs");
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

const relativeProtoFiles = protoFiles.map(file =>
  relative(ROOT, file)
);

const command = [
  `protoc`,
  `--plugin=protoc-gen-ts_proto=".\\node_modules\\.bin\\protoc-gen-ts_proto.cmd"`,
  `--ts_proto_opt=esModuleInterop=true,importSuffix=.js,outputTypeRegistry=true`,
  `--ts_proto_out=${OUT_DIR}`,
  `-I=src`, // root must prefix the proto paths
  ...relativeProtoFiles.map(f => `"${f}"`)
].join(" ");

console.log("Running:", command);

execSync(command, { stdio: "inherit" });


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

      if(path.basename(file, ".ts") === "typeRegistry") {
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

console.log("Done.");