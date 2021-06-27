"use strict";

class FixedPriorityScheduler extends Scheduler {
	constructor () {
		super (...arguments);
		this.taskQueues = [];
	}

	enqueueTask (task) {
		this.forceReschedule = true;
		if (!this.taskQueues[task.priority]) {
			this.taskQueues[task.priority] = [task];
		}
		else {
			this.taskQueues[task.priority].push (task);
		}
	}

	get numberOfTasks () {
		return this.taskQueues.reduce ( (aggr, queue) => queue ? aggr + queue.reduce ( (a, i) => a + 1, 0) : aggr, 0);
	}

	emptyTaskQueue () {
		this.taskQueues = [];
	}

	getNextTask () {
		ld = new Ld ();
		let highestPriority = this.taskQueues.length - 1;
		for (let i = highestPriority; i >= 0; i--) {
			// if the queue exists
			let queue = this.taskQueues[i];
			if (!queue) {
				continue;
			}
			// find a runable task
			let taskIndex = _.findIndex (queue, t => t.isRunnable);
			// if that exists, return the task
			if (taskIndex != -1) {
				let task = queue[taskIndex];
				_.pullAt (queue, taskIndex);
				return task;
			}
		}
		return undefined;
	}

	peekNextTask () {
		let highesPriority = this.taskQueues.length - 1;
		for (let i = highesPriority; i >= 0; i--) {
			let queue = this.taskQueues[i];
			if (!queue) {
				continue;
			}
			let taskIndex = _.findIndex (queue, t => t.isRunnable);
			if (taskIndex != -1) {
				return queue[taskIndex];
			}
		}
		return undefined;
	}

	needsReschedule () {
		if (!this.currentTask || !this.currentTask.isRunnable) {
			return true;
		}
		// check if there's another, higher priority task available
		let nextTask = this.peekNextTask ();
		if (nextTask && nextTask.priority > this.currentTask.priority) {
			return true;
		}
		return false;
	}
}
