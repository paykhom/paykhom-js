"use strict";


var DEFAULT_RTOS_CONFIG = Object.freeze ({
	scheduler: DEFAULT_SCHEDULER_CONFIG,
	debug: false
});

class EventLoop {
	constructor (config = DEFAULT_RTOS_CONFIG) {
		this.config = _.defaults ({}, config, DEFAULT_RTOS_CONFIG);
		// this.scheduler = new FixedPriorityScheduler (this.config.scheduler)
		if (this.config.scheduler.policy === 'FP') {
			this.scheduler = new FixedPriorityScheduler (this.config.scheduler);
		}
		else if (this.config.scheduler.policy === 'EDF') {
			this.scheduler = new DeadlineScheduler (this.config.scheduler);
		}
		else {
			throw new Error ("Unknown Scheduling Policy" + this.config.scheduler.policy);
		}
		this.scheduler.pause ();

	}


	addTask (task) {
		task.rtos = this;
		task.creationTime = performance.now();

		this.scheduler.addTask (task);
	}

	taskFromFn (fn, args, config) {
		let t = new CooperativeTask (config);
		t.run = fn.bind (t, ...args);
		t.rtos = this;
		return t;
	}

	addTaskFromFn (fn, args, config) {
		this.addTask (this.taskFromFn (fn, args, config));
	}

	spawnTask (task) {
		task.rtos = this;
		this.scheduler.spawnTask (task);
	}

	spawnTaskFromFn (fn, args, config) {
		this.scheduler.spawnTask (this.taskFromFn (fn, args, config));
	}

	start () {
		this.scheduler.resume ();
	}

	pause () {
		this.scheduler.pause ();
	}

	getExecutionTime () {
		if (this.scheduler.currentTask)
			return this.scheduler.currentTask.elapsedTime;
		return undefined;
	}

	getTime () {
		return Scheduler_2.getCurrentTimestamp ();
	}

	addAlarm (fn, delay, periodic = false) {
		this.scheduler.addAlarm (fn, delay, periodic);
	}

	getResource (resource) {
		if (resource == this.scheduler) {
			this.scheduler.NPCS = true;
		}
		else {
			throw new Error ("getResource is only implemented with rtos.scheduler");
		}
	}

	releaseResource (resource) {
		if (resource == this.scheduler) {
			this.scheduler.NPCS = false;
		}
		else {
			throw new Error ("getResource is only implemented with rtos.scheduler");
		}
	}
}
