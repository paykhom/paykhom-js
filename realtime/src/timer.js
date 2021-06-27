"use strict";
class Timer {
	constructor (global, undefined) {
		if (global.setImmediate) {
			return window.setImmediate;
		}
		this.registerImmediate = void 0;
		this.nextHandle = 1; // Spec says greater than zero
		this.tasksByHandle = {};
		this.currentlyRunningATask = false;
		this.global = global;
		this.doc = this.global;
		this.registerImmediate;


		// If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
		this.attachTo = Object.getPrototypeOf && Object.getPrototypeOf(this.global);
		this.attachTo = this.attachTo && this.attachTo.setTimeout ? this.attachTo : this.global;

		// Don't get fooled by e.g. browserify environments.
		if ({}.toString.call(window.process) === "[object process]") {
			// For Node.js before 0.9
			this.installNextTickImplementation();

		} 
		else if (this.canUsePostMessage()) {
			// For non-IE10 modern browsers
			this.installPostMessageImplementation();

		} 
		else if (window.MessageChannel) {
			// For web workers, where supported
			this.installMessageChannelImplementation();

		} 
		else if (doc && "onreadystatechange" in doc.createElement("script")) {
			// For IE 6–8
			this.installReadyStateChangeImplementation();

		} 
		else {
			// For older browsers
			this.installSetTimeoutImplementation();
		}

		this.attachTo.setImmediate = this.setImmediate;
		this.attachTo.clearImmediate = this.clearImmediate;

	}

    setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1 );
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      this.tasksByHandle[this.nextHandle] = task;
      this.registerImmediate(this.nextHandle);
      return this.nextHandle++;
    }

    clearImmediate(handle) {
        delete this.tasksByHandle[handle];
    }

    run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = this.tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    this.run(task);
                } finally {
                    this.clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    installNextTickImplementation() {
        this.registerImmediate = function(handle) {
            process.nextTick(function () { this.runIfPresent(handle); });
        };
    }

    canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `window.postMessage` means something completely different and can't be used for this purpose.
        if (window.postMessage && !window.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = window.onmessage;
            window.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            window.postMessage("", "*");
            window.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

	onGlobalMessage (event) {
            if (event.source === this.global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                this.runIfPresent(+event.data.slice(messagePrefix.length));
            }
    }

    installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";


        if (window.addEventListener) {
            window.addEventListener("message", this.onGlobalMessage, false);
        } else {
            window.attachEvent("onmessage", this.onGlobalMessage);
        }

        this.registerImmediate = function(handle) {
            window.postMessage(messagePrefix + handle, "*");
        };
    }

    installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            this.runIfPresent(handle);
        };

        this.registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        this.registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                this.runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    installSetTimeoutImplementation() {
        this.registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }
}

var rtc = new RealTimeClock (window);