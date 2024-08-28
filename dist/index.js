#! /usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Get the __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const program = new Command();
console.log(figlet.textSync("Dir Manager"));
program
    .version("1.0.0")
    .description("An example CLI for managing a directory")
    .option("-l,--ls [value]", "List directory contents")
    .option("-m --mkdir <value>", "Create a directory")
    .option("-t --touch <value>", "Create a file")
    .parse(process.argv);
const options = program.opts();
async function listDirContents(filePath) {
    try {
        const files = await fs.promises.readdir(filePath);
        const detailedFilesPromises = files.map(async (file) => {
            let fileDetails = await fs.promises.lstat(path.resolve(filePath, file));
            const { size, birthtime } = fileDetails;
            return {
                filename: file,
                "size(KB)": size,
                created_at: birthtime,
            };
        });
        const detailedFiles = await Promise.all(detailedFilesPromises);
        console.table(detailedFiles);
    }
    catch (error) {
        console.log("Error occurred while reading the directory!", error);
    }
}
function createDir(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        console.log("The directory has been created successfully");
    }
}
function createFile(filePath) {
    fs.openSync(filePath, "w");
    console.log("An empty file has been created");
}
if (options.ls) {
    const filePath = typeof options.ls === "string" ? options.ls : __dirname;
    listDirContents(filePath);
}
if (options.mkdir) {
    createDir(path.resolve(__dirname, options.mkdir));
}
if (options.touch) {
    createFile(path.resolve(__dirname, options.touch));
}
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=index.js.map