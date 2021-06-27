"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REALTIME = exports.DEFAULT_REALTIME_CONFIG = void 0;
const Scheduler_1 = require("./Scheduler");
const FixedPriorityScheduler_1 = require("./FixedPriorityScheduler");
const DeadlineScheduler_1 = require("./DeadlineScheduler");
const Scheduler_2 = require("./Scheduler");
const Task_1 = require("./Task");
const lodash_1 = require("lodash");
exports.DEFAULT_REALTIME_CONFIG = Object.freeze({
    scheduler: Scheduler_1.DEFAULT_SCHEDULER_CONFIG,
    debug: false
});
/**
 * an REALTIME object is the central object, containing essentially every other objects of note
 */
class REALTIME {
    constructor(config = exports.DEFAULT_REALTIME_CONFIG) {
        this.config = lodash_1.defaults({}, config, exports.DEFAULT_REALTIME_CONFIG);
        // this.scheduler = new FixedPriorityScheduler(this.config.scheduler)
        if (this.config.scheduler.policy === 'FP') {
            this.scheduler = new FixedPriorityScheduler_1.FixedPriorityScheduler(this.config.scheduler);
        }
        else if (this.config.scheduler.policy === 'EDF') {
            this.scheduler = new DeadlineScheduler_1.DeadlineScheduler(this.config.scheduler);
        }
        else {
            throw new Error("Unknown Scheduling Policy" + this.config.scheduler.policy);
        }
        this.scheduler.pause();
    }
    /**
     * add a task to the schedulers queues
     */
    addTask(task) {
        task.rtjs = this;
        this.scheduler.addTask(task);
    }
    /**
     * create a new task object from a function
     * @param fn the generator function / iterator to be turned into a task
     * @param args the parameters to call the function with
     * @param config configuration options for the Task-constructor
     */
    taskFromFn(fn, args, config) {
        let t = new Task_1.Task(config);
        t.run = fn.bind(t, ...args);
        t.rtjs = this;
        return t;
    }
    /**
     * create new task from function and add it to the scheduler
     */
    addTaskFromFn(fn, args, config) {
        this.addTask(this.taskFromFn(fn, args, config));
    }
    /**
     * spawn a new task
     */
    spawnTask(task) {
        task.rtjs = this;
        this.scheduler.spawnTask(task);
    }
    /**
     * create a new task from function and spawn it
     */
    spawnTaskFromFn(fn, args, config) {
        this.scheduler.spawnTask(this.taskFromFn(fn, args, config));
    }
    /**
     * start / resume the scheduler
     */
    start() {
        this.scheduler.resume();
    }
    /**
     * pause the scheduler
     */
    pause() {
        this.scheduler.pause();
    }
    /**
     * Get the execution time of the currently running task
     */
    getExecutionTime() {
        if (this.scheduler.currentTask)
            return this.scheduler.currentTask.elapsedTime;
        return undefined;
    }
    /**
     * @return Get a a relative timestamp
     */
    getTime() {
        return Scheduler_2.getCurrentTimestamp();
    }
    /* see Scheduler.addAlarm() */
    addAlarm(fn, delay, periodic = false) {
        this.scheduler.addAlarm(fn, delay, periodic);
    }
    getResource(resource) {
        if (resource == this.scheduler) {
            this.scheduler.NPCS = true;
        }
        else {
            throw new Error("getResource is only implemented with rtjs.scheduler");
        }
    }
    releaseResource(resource) {
        if (resource == this.scheduler) {
            this.scheduler.NPCS = false;
        }
        else {
            throw new Error("getResource is only implemented with rtjs.scheduler");
        }
    }
}
exports.REALTIME = REALTIME;
