"use strict";

var CooperativeTaskType = {
	"Basic": "Basic",
	"Extended": "Extended",

};
/*
(function (CooperativeTaskType) {
	CooperativeTaskType["Basic"] = "Basic";
	CooperativeTaskType["Extended"] = "Extended";
}) (CooperativeTaskType = CooperativeTaskType || (CooperativeTaskType = {}));
*/
var CooperativeTaskStatus = {
	"Runnable": "Runnable",
	"Waiting": "Waiting",

};
/*
 (function (CooperativeTaskStatus) {
	CooperativeTaskStatus["Runnable"] = "Runnable";
	CooperativeTaskStatus["Waiting"] = "Waiting";
}) (CooperativeTaskStatus = CooperativeTaskStatus || (CooperativeTaskStatus = {}));
*/

class CooperativeTask {
	constructor (config) {
		this.priority = 0;
		this.deadline = 0;
		this.type = CooperativeTaskType.Basic;
		this.status = CooperativeTaskStatus.Runnable;
		this.originalPriority = 0;
		this.SchedulerMessage = SchedulerMessage;
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
		this.creationTime = getCurrentTimestamp (); // Sometimes overriden from the outside (Benchmarks)
		this.budget = config.budget || -1;
	}

	chainTask (task) {
		this.scheduler.addTask (task);
	}

	spawnTask (task) {
		this.rtos.spawnTask (task);
	}

	*run () {
		return SchedulerMessage.TerminateTask;
	}

	getAbsoluteDeadline () {
		return this.creationTime + this.deadline;
	}

	onTerminated () {

	}
}
