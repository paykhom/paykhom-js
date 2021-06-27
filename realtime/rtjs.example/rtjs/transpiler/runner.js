#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const index_1 = require("../index");
async function main(keepReadding, files) {
    let cwd = process.cwd();
    let constructors = files.map(file => [file, require(cwd + "/" + file).default]);
    let tasks = constructors.filter(([f, _]) => f.endsWith(".task.js"));
    let interrupts = constructors.filter(([f, _]) => f.endsWith(".interrupt.js"));
    let rtjs = new index_1.REALTIME({
        scheduler: {
            debug: true,
            numOfTicksBeforeReschedule: 1000000
        },
        debug: true
    });
    tasks.forEach(([file, T]) => {
        let name = lodash_1.last(file.split("/")).replace(".task.js", "");
        rtjs.addTask(new T({ name }));
    });
    if (keepReadding) {
        setInterval(() => {
            tasks.forEach(([file, T]) => {
                let name = lodash_1.last(file.split("/")).replace(".task.js", "");
                if (Math.random() > 0.3) {
                    rtjs.addTask(new T({ name }));
                }
            });
        }, 5000);
    }
    rtjs.start();
}
let args = lodash_1.drop(process.argv, 2);
let patterns = lodash_1.without(args, "--keepReadding");
let keepReadding = args.length !== patterns.length;
main(keepReadding, patterns)
    .catch(e => console.log(e));
