"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scheduler = exports.TimeoutState = exports.TaskState = exports.SchedulerMessage = exports.DEFAULT_SCHEDULER_CONFIG = exports.getCurrentTimestamp = void 0;
const Task_1 = require("./Task");
const lodash_1 = require("lodash");
const PriorityQueue = require("fastpriorityqueue");
/**
 * returns the current relative time, since the start of the webpage / script, in ms
 * @returns the current relative time in ms
 */
function getCurrentTimestamp() {
    return Number(typeof window === 'undefined' ? perf_hooks_1.performance.now() : window.performance.now());
}
exports.getCurrentTimestamp = getCurrentTimestamp;
exports.DEFAULT_SCHEDULER_CONFIG = Object.freeze({
    numOfTicksBeforeReschedule: 300,
    meanTimeToReschedule: 1,
    meanTimeToYield: 5,
    debug: false,
    policy: 'FP',
    // If there are no animation frames, it does not make sense to
    // request them. This normally means that we do not run in a browser.
    onRequestAnimationFrame: !(typeof requestAnimationFrame === 'undefined')
});
var SchedulerMessage;
(function (SchedulerMessage) {
    SchedulerMessage[SchedulerMessage["TerminateTask"] = 0] = "TerminateTask";
    SchedulerMessage[SchedulerMessage["Continue"] = 1] = "Continue";
})(SchedulerMessage = exports.SchedulerMessage || (exports.SchedulerMessage = {}));
class TaskState {
    /**
     * set up the structure
     * @param task the task to envelop
     * @param parent the parent structure
     */
    constructor(task, parent) {
        /**
         * the time the task has run, for accounting
         */
        this.elapsedTime = 0;
        /**
         * the number of ticks that this task was executed
         */
        this.elapsedTicks = 0;
        /**
         * return value of the task after it has finished
         */
        this.retval = null;
        /**
         * whether or not the task has finished running
         */
        this.completed = false;
        this.task = task;
        this.iterator = task.run();
        this.enqueuedTime = getCurrentTimestamp();
        this.parent = parent;
        if (parent) {
            this.absoluteDeadline = parent.absoluteDeadline;
        }
        else {
            this.absoluteDeadline = task.creationTime + task.deadline;
        }
    }
    get status() {
        return this.task.status;
    }
    set status(s) {
        this.task.status = s;
    }
    get priority() {
        return this.task.priority;
    }
    get isRunnable() {
        return this.task.status === Task_1.TaskStatus.Runnable;
    }
    get isWaiting() {
        return this.task.status == Task_1.TaskStatus.Waiting;
    }
    /**
     * call the generator function of the task again
     */
    next(input = undefined) {
        if (this.completed) {
            return SchedulerMessage.TerminateTask;
        }
        let n = this.iterator.next(input || this.lastAsyncRespose);
        if (n.done == true) {
            this.completed = true;
        }
        else {
            this.completed = false;
        }
        this.lastMessage = n.value;
        this.lastAsyncRespose = undefined;
        return this.lastMessage;
    }
    /**
     * update the times of the task and call onTermined()
     */
    terminate() {
        this.task.retval = this.retval;
        this.task.enqueuedTime = this.enqueuedTime;
        this.task.elapsedTime = this.elapsedTime;
        this.task.endTime = getCurrentTimestamp();
        this.task.onTerminated();
    }
    /**
     * convert task to a human readable string
     */
    toString() {
        return `${this.task.name} (priority: ${this.task.priority}, deadline: ${this.absoluteDeadline}): ${this.task.status} (${this.elapsedTime}ms)`;
    }
}
exports.TaskState = TaskState;
class TimeoutState {
}
exports.TimeoutState = TimeoutState;
/**
 * abstract scheduler class, interface for concrete deadline and fixed priority schedulers
 */
class Scheduler {
    /**
     * constructor, setting up a scheduler object
     * @param config set to DEFAULT_SCHEDULER_CONFIG, may use any other values
     */
    constructor(config = exports.DEFAULT_SCHEDULER_CONFIG) {
        /**
         * number of pauses of the scheduler, may be used nestedly
         */
        this.pauses = true;
        /**
         * How long was the scheduler active on the executor
         */
        this.schedulerTime = 0;
        /**
         * Timeout queue to manage more precise timeouts
         */
        this.timeoutQueue = new PriorityQueue((a, b) => {
            return b.timeout > a.timeout;
        });
        this.config = lodash_1.defaults({}, config, exports.DEFAULT_SCHEDULER_CONFIG);
    }
    get paused() { return this.pauses; }
    /**
     * print messages to stdout if the ''debug'' flag was set
     */
    debug(msg, ...optionalParams) {
        if (this.config.debug) {
            console.error(msg, ...optionalParams);
        }
    }
    /**
     * pauses the scheduler, may be used nestedly
     */
    pause() {
        this.pauses = true;
        this.debug("> Pausing Scheduler (pauses %i)", this.pauses);
    }
    /**
     * resumes the scheduler after pausing, may be used nestedly
     */
    resume() {
        if (this.pauses) {
            this.pauses = false;
            this.debug("> Resuming Scheduler (pauses %i)", this.pauses);
            this.repostMe();
        }
    }
    /**
     * re-introduces the scheduler itself to the event loop
     */
    repostMe() {
        //if ( this.config.onRequestAnimationFrame ) {
        //    requestAnimationFrame ( this.executeRound.bind( this ) )
        //} else {
        if (!this.pauses) {
            setImmediate(this.executeRound.bind(this));
        }
        //}
    }
    /**
     * Add a single-short or periodic alarm function.
     * @param fn - The function to be callled after the delay has passed
     * @param delay - The deay in miliseconds
     * @param periodic - Whether the alarm is enqueued again
     *
     */
    addAlarm(fn, delay, periodic = false) {
        let scheduler = this;
        let ts = new TimeoutState();
        ts.timeout = 0;
        function startTimeout() {
            // If we were triggered too late for the next activation,
            // we use the current time as the next starting point
            let now = getCurrentTimestamp();
            if (now > (ts.timeout + delay)) {
                ts.timeout = now;
            }
            ts.timeout += delay; // trigger at the exact next timeout time
            scheduler.timeoutQueue.add(ts);
            ts.js_timeout = setTimeout(ts.js_callback, ts.timeout - now);
        }
        // Setup the Javascript Timeout
        ts.js_callback = () => {
            scheduler.timeoutQueue.removeOne(t => t == ts);
            if (periodic) {
                startTimeout();
            }
            fn();
        };
        // Setup the bAUTOSAR timeout. This is called from the scheduler
        ts.callback = () => {
            clearTimeout(ts.js_timeout);
            if (periodic) {
                startTimeout();
            }
            fn();
        };
        // Start the timeout for the first time
        startTimeout();
        return ts;
    }
    /**
     * add a task to the queue of the scheduler, sends a scheduler-message to event queue after it is finished, if no task is running atm
     * @param task the task object to enqueue
     * @param parent optional parameter, scheduler-structure for the parent task if any
     */
    addTask(task, parent) {
        this.debug("> Adding Task %s with priority %i and deadline %i", task.name, task.priority, task.deadline);
        task.scheduler = this;
        this.enqueueTask(new TaskState(task, parent));
        this.resume();
        /*if (this.currentTask === undefined && !this.paused) {
           this.repostMe()
        }*/
    }
    /**
     * Used by tasks to spawn new tasks, sets the currently running one as the parent
     * @param task the child task
     */
    spawnTask(task) {
        if (this.currentTask) {
            this.currentTask.status = Task_1.TaskStatus.Waiting;
            task.parent = this.currentTask.task;
        }
        this.addTask(task, this.currentTask);
    }
    /**
     * swaps the currently running task with a new one, uses needsReschedule()
     */
    prepareNextTask() {
        if (this.paused) {
            return;
        }
        if (this.NPCS && this.currentTask) {
            return;
        } // Obey the non-preemptive critical section
        // if the currently running task is not runnable or not completed it is re-enqueued for the scheduler to consider
        if (this.currentTask && (!this.currentTask.isRunnable || !this.currentTask.completed)) {
            this.debug("> Reenqueuing Task %s", this.currentTask.toString());
            this.enqueueTask(this.currentTask);
        }
        // determine next task
        this.currentTask = this.getNextTask();
        // Rescheduling done, clear flag
        this.forceReschedule = false;
        // all tasks are executed correctly
        if (!this.currentTask) {
            if (this.numberOfTasks === 0) {
                this.debug("> All out of tasks, calling isDone handler");
                //this.isDone()
                this.pause();
            }
            return;
        }
        this.debug("> Reschedule to: %s", this.currentTask.toString());
    }
    /**
     * Execute the current thread for a single timelice
     */
    executeTimelice() {
        if (!this.currentTask) {
            return;
        }
        let __step_start = getCurrentTimestamp();
        let __start;
        let __end = __step_start;
        let taskProgress = 0;
        do {
            if (this.paused || this.currentTask.status !== Task_1.TaskStatus.Runnable) {
                break;
            }
            /* If a component requests that we reschedule immediately, we will obey! */
            if (this.forceReschedule) {
                break;
            }
            /** We run the current task for one budget (REALTIME_BUDGET). The task can hit
             * introduced preemption points that often, before it actually calls yield */
            if (this.currentTask.task.budget > -1) {
                this.REALTIME_BUDGET = this.currentTask.task.budget;
            }
            else {
                this.REALTIME_BUDGET = this.config.numOfTicksBeforeReschedule;
            }
            __start = getCurrentTimestamp();
            let msg = this.currentTask.next(); /* Execute! */
            __end = getCurrentTimestamp();
            /* We account for the elapsed time */
            taskProgress += __end - __start;
            this.currentTask.elapsedTime += __end - __start;
            this.currentTask.elapsedTicks += 1;
            /* Process the message from the thread. */
            if (msg instanceof Promise) {
                let taskStatus = this.currentTask;
                taskStatus.status = Task_1.TaskStatus.Waiting;
                msg.then(result => {
                    taskStatus.lastAsyncRespose = result;
                    taskStatus.status = Task_1.TaskStatus.Runnable;
                    if (!this.currentTask) {
                        this.repostMe();
                    }
                });
                break;
            }
            else if (msg === SchedulerMessage.TerminateTask || this.currentTask.completed) {
                if (!(msg === SchedulerMessage.TerminateTask)) {
                    this.currentTask.retval = msg;
                }
                this.terminateTask();
                break;
            }
        } while ((__end - __step_start) < this.config.meanTimeToReschedule);
        // Poll the timeout queue
        do {
            let el = this.timeoutQueue.peek();
            if (!el) {
                break;
            }
            // Next timeout is more than 1 milisecond away
            if ((el.timeout - __end) > 1) {
                break;
            } // FIXME: Timeout granularity
            this.timeoutQueue.poll(); // remove el
            el.callback();
        } while (true);
        this.debug("Scheduler Timeslice: %d ms/%d ms", (__end - __step_start), taskProgress);
    }
    /**
     * terminates the currently running task
     */
    terminateTask() {
        if (!this.currentTask)
            return;
        this.debug("> TerminateTask: Task %s with priority %i (time: %i ms)", this.currentTask.task.name, this.currentTask.priority, this.currentTask.elapsedTime);
        if (this.currentTask.parent) {
            this.currentTask.parent.lastAsyncRespose = this.currentTask.lastMessage;
            this.currentTask.parent.status = Task_1.TaskStatus.Runnable;
        }
        this.currentTask.terminate();
        this.forceReschedule = true;
        this.NPCS = false;
        this.currentTask = undefined;
    }
    /**
     * if the scheduler is not paused, and there are still tasks left, run
     * the scheduler for meanTimeToYield miliseconds
     */
    executeRound() {
        let __round_start = getCurrentTimestamp();
        let __round_end = __round_start;
        do {
            if (this.paused) {
                break;
            }
            if (this.forceReschedule || this.needsReschedule()) {
                this.prepareNextTask();
            }
            if (!this.currentTask) {
                break;
            }
            if (this.currentTask.status == Task_1.TaskStatus.Runnable) {
                this.executeTimelice();
            }
            else {
                break;
            }
            __round_end = getCurrentTimestamp();
        } while ((__round_end - __round_start) < this.config.meanTimeToYield);
        this.debug("Scheduler Round: %d ms");
        this.schedulerTime += __round_end - __round_start;
        // Yield to the mainloop
        this.repostMe();
    }
}
exports.Scheduler = Scheduler;
