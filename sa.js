'use strict';

//import * as dp from './dp.js'

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// SOFTWARE ARCHITECTURE //////////////////////////////////////////////////////////////////////////// //


// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// Design By Contract

class Dbc extends Class {
	constructor (config) {
		super (config);
	}

    assert (condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }    

    preCondition (condition, msg) {
        this.assert (condition, msg);
    }

    condition (condition, msg) {
        this.assert (condition, msg);
    }

    postCondition (condition, msg) {
        this.assert (condition, msg);
    }

    requrie (condition, msg) {
        this.assert (condition, msg);
    }

    ensure (condition, msg) {
        this.assert (condition, msg);
    }

    invariant (condition, msg) {
        this.assert (condition, msg);
    }

}

// /Design By Contract
// ////////////////////////////////////////////////////////////////////////////////////////////////// //


// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// TDD

class Tdd extends Class {
	constructor () {
        super ();
        this.total = 0;
        this.pass = 0;
        this.failure = 0;
        //console.log ("BeginTestSuite");
	}

    log (message) {
        console.log (message);
    }

    run (method, ...args) {
        method.call (this, ...args);
    }

    condition (condition, message) {
        this.total++;
        if (!condition) {
            message = message || "Assertion failed";
            /*
            if (typeof Error !== "undefined") {
                //throw new Error(message);
                console.log (message + " [FAILURE]");
            }
            */
            //throw message; // Fallback
            console.log (message + " [FAILURE]");
            this.failure++;
        }
        else {
            console.log (message + " [PASS]");
            this.pass++;
        }
    }


}

// /TDD
// ////////////////////////////////////////////////////////////////////////////////////////////////// //

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// Simulation Helper

class Simulator extends Class {
	constructor () {
		super ();
	}


    /**
    breakpoint
    **/
    bp () {
        debugger;
    }


    /**
    simulate
    **/
    run (method, self = this, ...args) {
        let ret = null;
        if (method)
            ret = method.call (self, ...args);
        return ret || 0;
    }

    /**
    simulate before breakpoint
    **/
    runBeforeBp (method, self = this, ...args) {
        let ret = null;
        if (method)
            ret = method.call (self, ...args);
        debugger;
        return ret || 0;
    }

    /**
    simulate after breakpoint
    **/
    runAfterBp (method, self = this, ...args) { 
        debugger;
        return method.call (self, ...args) || 0;
    }

    /**
    simulate
    **/
//    runAsync (method, self = this, ...args) {
// 		let ret = null;
// 		if (method)
// 			ret = await method.call (self, ...args);
// 		return ret || 0;
// 	}

	/**
	simulate before breakpoint
	**/
	// runAsyncBeforeBp (method, self = this, ...args) {
	// 	let ret = null;
	// 	if (method)
	// 		ret = await method.call (self, ...args);
	// 	debugger;
	// 	return ret || 0;
	// }

	/**
	simulate after breakpoint
	**/
	// runAsyncAfterBp (method, self = this, ...args) { 
	// 	debugger;
	// 	return await method.call (self, ...args) || 0;
	// }

/***
    simulate input
    **/
    in (from, to = null) {
        if (to)
            to = from;
        return to || from;
    }

    /***
    simulate output
    **/
    out (to, from) {
        to = from;
        return to;
    }

    assert (...args) {
        console.assert (...args);
    }

    clear () {
        console.clear ();
    }

    count (arg = null) {
        console.count (arg);
    }

    countReset (arg = null) {
        console.countReset (arg);
    }

    debug (...args) {
        console.debug (...args);
    }

    dir (arg) {
        console.dir (arg);
    }

    dirxml (arg) {
        console.dirxml (arg);
    }

    error (...args) {
        console.error (...args);
    }

    group (arg = null) {
        console.group (arg);
    }

    groupCollapsed (arg = null) {
        console.groupCollapsed (arg);
    }

    groupEnd () {
        console.groupEnd ();
    }

    info (...args) {
        console.info (...args);
    }

    log (...args) {
        console.log (...args);
    }

    profile (arg) {
        console.profile (arg);
    }

    profileEnd (arg) {
        console.profileEnd (arg);
    }

    table (arr) {
        console.table (arr);
    }

    time (arg) {
        console.time (arg);
    }

    timeEnd (arg) {
        console.timeEnd (arg);
    }

    timeLog (arg) {
        console.timeLog (arg);
    }

    timeStamp (arg) {
        console.timeStamp (arg);
    }

    trace (...args) {
        console.trace (...args);
    }

    warn (...args) {
        console.warn (...args);
    }



}

// /Simulation Helper
// ////////////////////////////////////////////////////////////////////////////////////////////////// //
