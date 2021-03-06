"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const { Task } = require("../rtjs/Task.js");
const BOX_PRIO = 100;
const BOX_DEADLINE = 1;
/**
 * @file boxTask
 * contains the Box type. It's a class representing the moving box on screen.
 * animationFn is a one shot very short REALTIME task, which moves the box.
 * after it is finished, it will re-instate itself into the run-queue, on
 * the requestAnimationFrame - interrupt
 */
class Box extends Task {
    constructor(rtjs) {
        super({
            name: "BoxTask",
            priority: BOX_PRIO,
            deadline: BOX_DEADLINE
        });
        this.last = {
            x: 0,
            direction: "right"
        };
        this.box = document.querySelector("#box");
        this.last.x = box.offsetLeft;
        this.rtjs = rtjs;
    }
    // @rtjs
    *run() {
        if (this.last.direction === "right") {
            this.last.x += 10;
            this.box.textContent = "I'm moving! /o/";
        }
        else {
            this.last.x -= 10;
            this.box.textContent = "I'm moving! \\o\\";
        }
        if (this.last.x >= window.innerWidth - this.box.clientWidth - 10) {
            this.last.direction = "left";
        }
        else if (this.last.x <= 10) {
            this.last.direction = "right";
        }
        this.box.style["left"] = this.last.x;
        return this.SchedulerMessage.TerminateTask;
    }
    addTask() {
        if (this.rtjs != null) {
            this.creationTime = performance.now();
            this.rtjs.addTask(this);
        }
        requestAnimationFrame(this.addTask.bind(this));
    }
    onTerminate() { }
}
exports.Box = Box;
