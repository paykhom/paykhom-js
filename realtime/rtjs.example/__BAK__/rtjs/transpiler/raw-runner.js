#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
async function main(useAsyncAwait, files) {
    let cwd = process.cwd();
    let tasks = files.map(file => [file, require(cwd + "/" + file).run]);
    if (useAsyncAwait) {
        tasks.forEach(async ([file, run]) => {
            let name = lodash_1.last(file.split("/")).replace(".js", "");
            console.time(name);
            console.log(name, await run());
            console.timeEnd(name);
            console.log(" ");
        });
    }
    else {
        tasks.forEach(([file, run]) => {
            let name = lodash_1.last(file.split("/")).replace(".js", "");
            console.time(name);
            console.log(name, run());
            console.timeEnd(name);
        });
    }
}
let args = lodash_1.drop(process.argv, 2);
let asyncAwaitIndex = args.indexOf("--await");
let useAsyncAwait = asyncAwaitIndex !== -1;
let files = lodash_1.filter(args, a => a !== "--await");
main(useAsyncAwait, files)
    .catch(e => console.log(e));
