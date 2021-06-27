"use strict";

class DeadlineScheduler extends Scheduler {
	constructor () {
		super (...arguments);
		this.taskQueue = new FastPriorityQueue ( (a, b) => {
			return b.absoluteDeadline > a.absoluteDeadline;
		});
	}

	enqueueTask (task) {
		this.forceReschedule = true;
		this.taskQueue.add (task);
	}

	emptyTaskQueue () {
		while (this.taskQueue.poll () !== undefined)
		;
	}

	needsReschedule () {
		if (!this.currentTask || !this.currentTask.isRunnable) {
			return true;
		}
		let el = this.taskQueue.peek ();
		if (el && el.absoluteDeadline < this.currentTask.absoluteDeadline) {
			return true;
		}
		return false;
	}

	get numberOfTasks () {
		return this.taskQueue.size;
	}


	getNextTask () {
		return this.taskQueue.removeOne (t => t.isRunnable);
	}
}
