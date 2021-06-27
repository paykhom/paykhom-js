"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = exports.TaskType = void 0;
const Scheduler_1 = require("./Scheduler");
var TaskType;
(function (TaskType) {
    TaskType["Basic"] = "Basic";
    TaskType["Extended"] = "Extended";
})(TaskType = exports.TaskType || (exports.TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Runnable"] = "Runnable";
    TaskStatus["Waiting"] = "Waiting";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
/**
 * task class
 */
class Task {
    constructor(config) {
        this.priority = 0;
        this.deadline = 0;
        this.type = TaskType.Basic;
        this.status = TaskStatus.Runnable;
        this.originalPriority = 0;
        this.SchedulerMessage = Scheduler_1.SchedulerMessage;
        this.elapsedTime = 0; // How long did the task actually execute
        this.cancel_on_deadline = false;
        this.cancelled = false;
        this.retval = null; // return value of the finished task
        this.name = config.name;
        this.parent = config.parent;
        this.priority = config.priority || 0;
        this.originalPriority = this.priority;
        this.deadline = config.deadline || -1;
        this.wcet = config.wcet;
        this.creationTime = Scheduler_1.getCurrentTimestamp(); // Sometimes overriden from the outside (Benchmarks)
        this.budget = config.budget || -1;
    }
    /**
     * add a task to the system
     * @param task the task to add
     */
    chainTask(task) {
        this.scheduler.addTask(task);
    }
    /**
     * spwan a task to the system
     * @param task the task to spawn
     */
    spawnTask(task) {
        this.rtjs.spawnTask(task);
    }
    /**
     * the generator function of this task
     */
    *run() {
        return Scheduler_1.SchedulerMessage.TerminateTask;
    }
    getAbsoluteDeadline() {
        return this.creationTime + this.deadline;
    }
    /**
     * a callback to be used when the task is terminated
     */
    onTerminated() {
    }
}
exports.Task = Task;
