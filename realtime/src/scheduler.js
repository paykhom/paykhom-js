"use strict";

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentTimestamp () {
	return Number (typeof window === 'undefined' ? performance.now () : window.performance.now ());
}

var DEFAULT_SCHEDULER_CONFIG = Object.freeze ({
	numOfTicksBeforeReschedule: 300,
	meanTimeToReschedule: 1,
	meanTimeToYield: 5,
	debug: false,
	policy: 'FP',
	//onRequestAnimationFrame: ! (typeof requestAnimationFrame === 'undefined')
});

var SchedulerMessage;
 (function (SchedulerMessage) {
	SchedulerMessage[SchedulerMessage["TerminateTask"] = 0] = "TerminateTask";
	SchedulerMessage[SchedulerMessage["Continue"] = 1] = "Continue";
}) (SchedulerMessage = SchedulerMessage || (SchedulerMessage = {}));

class TaskState {
	constructor (task, parent) {
		this.elapsedTime = 0;
		this.elapsedTicks = 0;
		this.retval = null;
		this.completed = false;
		this.task = task;
		this.iterator = task.run ();
		this.enqueuedTime = getCurrentTimestamp ();
		this.parent = parent;

		if (parent) {
			this.absoluteDeadline = parent.absoluteDeadline;
		}
		else {
			this.absoluteDeadline = task.creationTime + task.deadline;
		}
	}

	get status () {
		return this.task.status;
	}

	set status (s) {
		this.task.status = s;
	}

	get priority () {
		return this.task.priority;
	}

	get isRunnable () {
		return this.task.status === CooperativeTaskStatus.Runnable;
	}

	get isWaiting () {
		return this.task.status == CooperativeTaskStatus.Waiting;
	}

	next (input = undefined) {
		if (this.completed) {
			return SchedulerMessage.TerminateTask;
		}

		let n = this.iterator.next (input || this.lastAsyncRespose);
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

	terminate () {
		this.task.retval = this.retval;
		this.task.enqueuedTime = this.enqueuedTime;
		this.task.elapsedTime = this.elapsedTime;
		this.task.endTime = getCurrentTimestamp ();
		this.task.onTerminated ();
	}

	toString () {
		return `${this.task.name} (priority: ${this.task.priority}, deadline: ${this.absoluteDeadline}): ${this.task.status} (${this.elapsedTime}ms)`;
	}
}

class TimeoutState {

}

// ////////////////////////////////////////////////////////////////////////////////////////////// //

class Scheduler {
	constructor (config = DEFAULT_SCHEDULER_CONFIG) {
		this.pauses = true;
		this.me = this;
		this.schedulerTime = 0;
		this.timeoutQueue = new FastPriorityQueue ( (a, b) => {
			return b.timeout > a.timeout;
		});
		//ld = new Ld ();
		this.config = _.defaults ({}, config, DEFAULT_SCHEDULER_CONFIG);

		//
		//this.timer = new RealTimeClock (typeof self === "undefined" ? typeof global === "undefined" ? this : global : self);
		//this.timer = new RealTimeClock (window);
		//this.timer = rtc;

		this.isTickerBusy = false;

		this.runTick.call (this.me);

	}

	runTick () {
		var me = this;

		setTimeout(() => {
			me.onTick.call (me);
		}, 0);

	}
	
	onTick () {
		if (this.isTickerBusy) {
			console.log("Tick: MISS");
			return;
		}

		this.isTickerBusy = true;
		console.log("Tick: HIT");
		//await sleep (Math.random ()*200);

		this.executeRound ();

		this.isTickerBusy = false;
	}

	get paused () { 
		return this.pauses; 
	}

	debug (msg, ...optionalParams) {
		if (this.config.debug) {
			console.error (msg, ...optionalParams);
		}
	}

	pause () {
		this.pauses = true;
		this.debug ("> Pausing Scheduler (pauses %i)", this.pauses);
	}

	resume () {
		if (this.pauses) {
			this.pauses = false;
			this.debug ("> Resuming Scheduler (pauses %i)", this.pauses);
			this.runTick.call (this.me);
		}
	}




	addAlarm (fn, delay, periodic = false) {
		let scheduler = this;
		let ts = new TimeoutState ();
		ts.timeout = 0;
		function startTimeout () {
			// If we were triggered too late for the next activation,
			// we use the current time as the next starting point
			let now = getCurrentTimestamp ();
			if (now > (ts.timeout + delay)) {
				ts.timeout = now;
			}
			ts.timeout += delay; // trigger at the exact next timeout time
			scheduler.timeoutQueue.add (ts);
			ts.js_timeout = setTimeout (ts.js_callback, ts.timeout - now);
		}

		// Setup the Javascript Timeout
		ts.js_callback = () => {
			scheduler.timeoutQueue.removeOne (t => t == ts);
			if (periodic) {
				startTimeout ();
			}
			fn ();
		};

		// Setup the bAUTOSAR timeout. This is called from the scheduler
		ts.callback = () => {
			clearTimeout (ts.js_timeout);
			if (periodic) {
				startTimeout ();
			}
			fn ();
		};

		// Start the timeout for the first time
		startTimeout ();

		return ts;
	}

	addTask (task, parent) {
		this.debug ("> Adding Task %s with priority %i and deadline %i", task.name, task.priority, task.deadline);
		task.scheduler = this;
		this.enqueueTask (new TaskState (task, parent));
		this.resume ();

 		
		/*if (this.currentTask === undefined && !this.paused) {
			this.runTick.call (this.me);
		}*/
	}

	spawnTask (task) {
		if (this.currentTask) {
			this.currentTask.status = CooperativeTaskStatus.Waiting;
			task.parent = this.currentTask.task;
		}
		this.addTask (task, this.currentTask);
	}

	prepareNextTask () {
		if (this.paused) {
			return;
		}
		if (this.NPCS && this.currentTask) {
			return;
		} // Obey the non-preemptive critical section

		// if the currently running task is not runnable or not completed it is re-enqueued for the scheduler to consider
		if (this.currentTask && (!this.currentTask.isRunnable || !this.currentTask.completed)) {
			this.debug ("> Reenqueuing Task %s", this.currentTask.toString ());
			this.enqueueTask (this.currentTask);
		}

		// determine next task
		this.currentTask = this.getNextTask ();

		// Rescheduling done, clear flag
		this.forceReschedule = false;

		// all tasks are executed correctly
		if (!this.currentTask) {
			if (this.numberOfTasks === 0) {
				this.debug ("> All out of tasks, calling isDone handler");
				//this.isDone ()
				this.pause ();
			}
			return;
		}

		this.debug ("> Reschedule to: %s", this.currentTask.toString ());
	}

	executeRound () {
		let __round_start = getCurrentTimestamp ();
		let __round_end = __round_start;
		do {
			if (this.paused) {
				break;
			}
			if (this.forceReschedule || this.needsReschedule ()) {
				this.prepareNextTask ();
			}
			if (!this.currentTask) {
				break;
			}
			if (this.currentTask.status == CooperativeTaskStatus.Runnable) {
				this.executeTimelice ();
			}
			else {
				break;
			}
			__round_end = getCurrentTimestamp ();
		} while ( (__round_end - __round_start) < this.config.meanTimeToYield);

		this.debug ("Scheduler Round: %d ms");
		this.schedulerTime += __round_end - __round_start;

		if (this.currentTask)
			this.runTick.call (this)
		;
	}

	executeTimelice () {
		if (!this.currentTask) {
			return;
		}

		let __step_start = getCurrentTimestamp ();
		let __start;
		let __end = __step_start;
		let taskProgress = 0;

		do {
			if (this.paused || this.currentTask.status !== CooperativeTaskStatus.Runnable) {
				break;
			}

			if (this.forceReschedule) {
				break;
			}

			if (this.currentTask.task.budget > -1) {
				this.RTOS_BUDGET = this.currentTask.task.budget;
			}
			else {
				this.RTOS_BUDGET = this.config.numOfTicksBeforeReschedule;
			}
			__start = getCurrentTimestamp ();

			let msg = this.currentTask.next (); /* exeCUTE! */

			__end = getCurrentTimestamp ();

			taskProgress += __end - __start;
			this.currentTask.elapsedTime += __end - __start;
			this.currentTask.elapsedTicks += 1;

			if (msg instanceof Promise) {
				let taskStatus = this.currentTask;
				taskStatus.status = CooperativeTaskStatus.Waiting;
				msg.then (result => {
					taskStatus.lastAsyncRespose = result;
					taskStatus.status = CooperativeTaskStatus.Runnable;
					if (!this.currentTask) {
						this.runTick.call (this.me);
					}
				});
				break;
			}
			else if (msg === SchedulerMessage.TerminateTask || this.currentTask.completed) {
				if (! (msg === SchedulerMessage.TerminateTask)) {
					this.currentTask.retval = msg;
				}
				this.terminateTask ();
				break;
			}
		} while ( (__end - __step_start) < this.config.meanTimeToReschedule);

		do {
			let toq = this.timeoutQueue.peek ();
			if (!toq) {
				break;
			}
			// Next timeout is more than 1 milisecond away
			if ( (toq.timeout - __end) > 1) {
				break;
			} // FIXME: Timeout granularity
			this.timeoutQueue.poll (); // remove toq
			toq.callback ();
		} while (true);
		this.debug ("Scheduler Timeslice: %d ms/%d ms", (__end - __step_start), taskProgress);
	}

	terminateTask () {
		if (!this.currentTask)
			return;

		this.debug ("> TerminateTask: Task %s with priority %i (time: %i ms)", this.currentTask.task.name, this.currentTask.priority, this.currentTask.elapsedTime);

		if (this.currentTask.parent) {
			this.currentTask.parent.lastAsyncRespose = this.currentTask.lastMessage;
			this.currentTask.parent.status = CooperativeTaskStatus.Runnable;
		}

		this.currentTask.terminate ();
		this.forceReschedule = true;
		this.NPCS = false;
		this.currentTask = undefined;
	}

}
