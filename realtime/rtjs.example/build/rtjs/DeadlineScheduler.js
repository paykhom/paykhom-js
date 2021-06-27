"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadlineScheduler = void 0;
const Scheduler_1 = require("./Scheduler");
const PriorityQueue = require("fastpriorityqueue");
/**
 * Deadline based scheduler implementation, based on Scheduler
 * implements EDF scheme
 */
class DeadlineScheduler extends Scheduler_1.Scheduler {
    constructor() {
        super(...arguments);
        /**
         * queue used for managing the tasks, sorted by the deadline-member of the task structures
         */
        this.taskQueue = new PriorityQueue((a, b) => {
            return b.absoluteDeadline > a.absoluteDeadline;
        });
    }
    /**
     * enqueues a task into the queue
     */
    enqueueTask(task) {
        this.forceReschedule = true;
        this.taskQueue.add(task);
    }
    emptyTaskQueue() {
        while (this.taskQueue.poll() !== undefined)
            ;
    }
    /**
     * determines, whether or not the scheduler needs to reshedule, based on the time passed
     */
    needsReschedule() {
        if (!this.currentTask || !this.currentTask.isRunnable) {
            return true;
        }
        let el = this.taskQueue.peek();
        if (el && el.absoluteDeadline < this.currentTask.absoluteDeadline) {
            return true;
        }
        return false;
    }
    /**
     * returns the number of tasks in the queue
     */
    get numberOfTasks() {
        return this.taskQueue.size;
    }
    /**
     * returns the next task to run
     */
    getNextTask() {
        return this.taskQueue.removeOne(t => t.isRunnable);
    }
}
exports.DeadlineScheduler = DeadlineScheduler;
