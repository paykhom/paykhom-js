#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("./compiler");
const globCB = require("glob");
const ts = require("typescript");
const lodash_1 = require("lodash");
const util_1 = require("util");
let glob = util_1.promisify(globCB);
async function main(pattern) {
    let files = await glob(pattern);
    let diagnostics = await compiler_1.compile(undefined, files);
    diagnostics.forEach(diagnostic => {
        if (!diagnostic.file) {
            console.log(diagnostic);
            return;
        }
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
    });
}
main(lodash_1.drop(process.argv, 2).join("|"))
    .catch(e => console.log(e));
