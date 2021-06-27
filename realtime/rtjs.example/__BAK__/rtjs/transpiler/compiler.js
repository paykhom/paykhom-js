"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.DEFAULT_COMPILER_CONFIG = void 0;
const ts = require("typescript");
const parser_1 = require("./parser");
const transforms_1 = require("./transforms");
const fs = require("fs");
const util_1 = require("util");
const lodash_1 = require("lodash");
exports.DEFAULT_COMPILER_CONFIG = Object.freeze({
    transformConfig: transforms_1.DEFAULT_TRANSFORM_CONFIG
});
let writeFile = util_1.promisify(fs.writeFile);
async function writeFileCallback(fileName, data, writeByteOrderMark, onError, sourceFiles) {
    try {
        await writeFile(fileName, data);
    }
    catch (e) {
        console.error(e);
    }
}
function snapFor(path, files) {
    if (path === "lib.d.ts") {
        return ts.ScriptSnapshot.fromString("");
    }
    const result = lodash_1.find(files, f => f.fileName === path);
    return result && ts.ScriptSnapshot.fromString(result.text);
}
function programFiles(program) {
    return lodash_1.map(program.getSourceFiles(), f => {
        if (f.fileName.startsWith("/")) {
            return f.fileName;
        }
        return process.cwd() + "/" + f.fileName;
    });
}
async function compile(config = exports.DEFAULT_COMPILER_CONFIG, sourceFiles, compilerOptions, writeCallback = writeFileCallback) {
    let program = parser_1.parse(sourceFiles, compilerOptions);
    let emitResult = program.emit(undefined, writeFileCallback, undefined, undefined, {
        before: [
            transforms_1.transform(config.transformConfig)
        ]
    });
    return ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
}
exports.compile = compile;
