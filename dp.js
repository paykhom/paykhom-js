'use strict';

// ////////////////////////////////////////////////////////////////////////////////////////////// //
// DESIGN PATTERNS


// ////////////////////////////////////////////////////////
// BASE

class Interface extends Object {
	constructor () {
		super ();
		this.me = this;
	}
}

class Class extends Interface {
	constructor () {
		super ();
		this.dep = {};
	}

    dbcCondition (condition, message) {
        if (!condition) {
            message = message || "Assertion failed";
            if (typeof Error !== "undefined") {
                throw new Error(message);
            }
            throw message; // Fallback
        }
    }    


}
class Struct extends Interface {
	constructor () {
		super ();
	}

}

class Context extends Struct {
	constructor () {
		super ();
	}

}


/*
    Six Primitive Data Types:
        [NOT_IMPLEMENTED] undefined : typeof instance === "undefined"
        Boolean : typeof instance === "boolean"
        Number : typeof instance === "number"
        String : typeof instance === "string"
        BigInt : typeof instance === "bigint"
        Symbol : typeof instance === "symbol"
    Structural Types:
        Object : typeof instance === "object". Special non-data but Structural type for any constructed object instance also used as data structures: new Object, new Array, new Map, new Set, new WeakMap, new WeakSet, new Date and almost everything made with new keyword;
        Function : a non-data structure, though it also answers for typeof operator: typeof instance === "function". This is merely a special shorthand for Functions, though every Function constructor is derived from Object constructor.
    Structural Root Primitive:
        [NOT_IMPLEMENTED] null : typeof instance === "object". Special primitive type having additional usage for its value: if object is not inherited, then null is shown;
*/

class DataType extends Object {
	constructor (type, val, isMutable = false) {
		super ();
		this.type = type;
		//this.val = val;
		this.err = null;

		this._value = null; //create the slot: not requried though, just for brevity
		this.mut = true;
		this.val = val;
		this.mut = isMutable;
	}

	get val () {
		return this._value;
	}

	set val (val) {
		if (typeof val === this.type && this.mut == true) {
			this._value = val;
		}
		else if (this.type === "function" && typeof val === "function" && this.mut == true)  {
			this._value = val;
		}
		else if (this.type === "object" && typeof val === "object" && this.mut == true)  {
			this._value = val;
		}
		else if (this.type === "option" && val instanceof Option && this.mut == true)  {
			this._value = val;
		}
		else if (this.type === "result" && val instanceof Result && this.mut == true)  {
			this._value = val;
		}
		else {
			throw "Data Type Error";
		}
	}
}



class BooleanType extends DataType {
	constructor (val) {
		super ("boolean", val);
	}
}


class NumberType extends DataType {
	constructor (val) {
		super ("number", val);
	}
}

class StringType extends DataType {
	constructor (val) {
		super ("string", val);
	}
}

class BigIntType extends DataType {
	constructor (val) {
		super ("bigint", val);
	}
}

class SymbolType extends DataType {
	constructor (val) {
		super ("symbol", val);
	}
}

class ObjectType extends DataType {
	constructor (val) {
		super ("object", val);
	}
}

class FunctionType extends DataType {
	constructor (val) {
		super ("function", val);
	}
}


class OptionType extends DataType {
	constructor (val) {
		super ("option", val);
	}
}

class ResultType extends DataType {
	constructor (val) {
		super ("result", val);
	}
}

// ////////////////////////////////////////////////////////
// RUST-LIKE DATA TYPES

/* USAGE:
Option<T>
// `Some<T>`
const some = new Some(1);
console.log(some.isSome); // true
console.log(some.unwrap()); // 1

// `None`
const none = new None();
console.log(none.isSome); // false
console.log(none.unwrap()); // this will throw `Error`.

*/

class Option {
	constructor (ok, val) {
		/**
		 *  @private
		 *  @type   {boolean}
		 */
		this.ok = ok;

		/**
		 *  @private
		 *  @type   {T|undefined}
		 */
		this.val = val;

	}

	/**
	 *  Return whether this is `Some<T>` or not.
	 *
	 *  @return {boolean}
	 */
	get isSome () {
		return this.ok;
	}

	/**
	 *  Return whether this is `None` or not.
	 *
	 *  @return {boolean}
	 */
	get isNone () {
		return !this.ok;
	}

	/**
	 *  Returns the inner `T` of a `Some<T>`.
	 *
	 *  @template   T
	 *
	 *  @return {T}
	 *  @throws {TypeError}
	 *	  Throws if the self value equals `None`.
	 */
	unwrap () {
		if (!this.ok) {
			throw new TypeError ('called `unwrap ()` on a `None` value');
		}

		return this.val;
	}

	/**
	 *  Returns the contained value or a default value `def`.
	 *
	 *  @template   T
	 *
	 *  @param  {T} def
	 *  @return {T}
	 */
	unwrapOr (def) {
		return this.ok ? this.val : def;
	}

	/**
	 *  Returns the contained value or computes it from a closure `fn`.
	 *
	 *  @template   T
	 *
	 *  @param  {function (): T} fn
	 *  @return {T}
	 */
	unwrapOrElse (fn) {
		return this.ok ? this.val : fn ();
	}

	/**
	 *  Returns the inner `T` of a `Some<T>`.
	 *
	 *  @template   T
	 *
	 *  @param  {string}  msg
	 *  @return {T}
	 *  @throws {TypeError}
	 *	  Throws a custom error with provided `msg`
	 *	  if the self value equals `None`.
	 */
	expect (msg) {
		if (!this.ok) {
			throw new TypeError (msg);
		}

		return this.val;
	}

	/**
	 *  Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.
	 *
	 *  @template   T, U
	 *
	 *  @param  {function (T):U}	fn
	 *  @return {!Option<U>}
	 */
	map (fn) {
		if (!this.ok) {
			// cheat to escape from a needless allocation.
			return this;
		}

		const value = fn (this.val);
		const option = new Some (value);
		return option;
	}

	/**
	 *  Returns `None` if the self is `None`,
	 *  otherwise calls `fn` with the wrapped value and returns the result.
	 *
	 *  @template   T, U
	 *
	 *  @param  {function (T): !Option<U>}	fn
	 *  @return {!Option<U>}
	 */
	flatMap (fn) {
		if (!this.ok) {
			// cheat to escape from a needless allocation.
			return this;
		}

		const mapped = fn (this.val);
		const isOption = mapped instanceof Option;
		if (!isOption) {
			throw new TypeError ("Option<T>.flatMap ()' param `fn` should return `Option<T>`.");
		}

		return mapped;
	}

	/**
	 *  Applies a function `fn` to the contained value or returns a default `def`.
	 *
	 *  @template   T, U
	 *
	 *  @param  {U} def
	 *  @param  {function (T):U} fn
	 *  @return {U}
	 */
	mapOr (def, fn) {
		if (this.ok) {
			return fn (this.val);
		} 
		else {
			return def;
		}
	}

	/**
	 *  Applies a function `fn` to the contained value or computes a default result by `defFn`.
	 *
	 *  @template   T, U
	 *
	 *  @param  {function ():U}  defFn
	 *  @param  {function (T):U} fn
	 *  @return {U}
	 */
	mapOrElse (defFn, fn) {
		if (this.ok) {
			return fn (this.val);
		} 
		else {
			return defFn ();
		}
	}

	/**
	 *  Returns `None` if the self is `None`, otherwise returns `optb`.
	 *
	 *  @template   U
	 *
	 *  @param  {!Option<U>} optb
	 *  @return {!Option<U>}
	 */
	and (optb) {
		return this.ok ? optb : this;
	}

	/**
	 *  The alias of `Option<T>.flatMap ()`.
	 *
	 *  @template   T, U
	 *
	 *  @param  {function (T): !Option<U>}	fn
	 *  @return {!Option<U>}
	 */
	andThen (fn) {
		return this.flatMap (fn);
	}

	/**
	 *  Returns the self if it contains a value, otherwise returns `optb`.
	 *
	 *  @template   T
	 *
	 *  @param  {!Option<T>} optb
	 *  @return {!Option<T>}
	 */
	or (optb) {
		return this.ok ? this : optb;
	}

	/**
	 *  Returns the self if it contains a value,
	 *  otherwise calls `fn` and returns the result.
	 *
	 *  @template   T
	 *
	 *  @param  {function (): !Option<T>} fn
	 *  @return {!Option<T>}
	 */
	orElse (fn) {
		if (this.ok) {
			return this;
		} 
		else {
			const value = fn ();
			if (value instanceof Option) {
				return value;
			}

			throw new TypeError ("Option<T>.orElse ()' param `fn` should return `Option<T>`.");
		}
	}

	/**
	 *  Finalize the self.
	 *  After this is called, the object's behavior is not defined.
	 *
	 *  @param  {function (T)=}  destructor
	 *	  This would be called with the inner value if self is `Some<T>`.
	 *  @return {void}
	 */
	drop (destructor) {
		if (this.ok && typeof destructor === 'function') {
			destructor (this.val);
		}

		this.val = null;
		//Object.freeze (this);
	}

	/**
	 *  @return {*}
	 */
	toJSON () {
		return {
			is_some: this.ok,
			value: this.val,
		};
	}

}



class Some extends Option {
	constructor (val) {
		super (true, val);
	}
}

class None extends Option {
	constructor (val) {
		super (false, undefined);
	}
}




/* USAGE:
Result<T, E>

This can express that there is some values or some error information.

// `Ok<T, E>`
const some = new Ok(1);
console.log(some.isOk()); // true
console.log(some.unwrap()); // 1
console.log(none.unwrapErr()); // this will throw `Error`.

// `Err<T, E>`
const none = new Err('some error info');
console.log(none.isOk()); // false
console.log(none.unwrap()); // this will throw `Error`.
console.log(none.unwrapErr()); // 'some error info'
*/
class Result extends Class {
	constructor (ok, val, err) {
		/**
		 *  @private
		 *  @type   {boolean}
		 */
		this._isOk = ok;

		/**
		 *  @private
		 *  @type   {T}
		 */
		this._v = val;

		/**
		 *  @private
		 *  @type   {E}
		 */
		this._e = err;

	}
    /**
     *  Returns true if the result is `Ok`.
     *
     *  @return {boolean}
     */
    isOk() {
        return this._isOk;
    }

    /**
     *  Returns true if the result is `Err`.
     *
     *  @return {boolean}
     */
    isErr () {
        return !this._isOk;
    }

    /**
     *  Converts from `Result<T, E>` to `Option<T>`.
     *  If the self is `Ok`, returns `Some<T>`.
     *  Otherwise, returns `None<T>`.
     *
     *  @return {!OptionT<T>}
     */
    ok () {
        if (this._isOk) {
            return new Some(this._v);
        } 
		else {
            return new None();
        }
    }

    /**
     *  Converts from `Result<T, E>` to `Option<E>`.
     *  If the self is `Err`, returns `Some<E>`.
     *  Otherwise, returns `None<E>`.
     *
     *  @return {!OptionT<E>}
     */
    err () {
        if (!this._isOk) {
            return new Some(this._e);
        } 
		else {
            return new None();
        }
    }

    /**
     *  Maps a `Result<T, E>` to `Result<U, E>` by applying a function `mapFn<T, U>`
     *  to an contained `Ok` value, leaving an `Err` value untouched.
     *
     *  This function can be used to compose the results of two functions.
     *
     *  @template   U
     *  @param  {!function(T):U}    op
     *  @return {!Result<U, E>}
     */
    map (op) {
        if (!this._isOk) {
            // cheat to escape from a needless allocation.
            return this;
        }

        const value = op(this._v);
        const result = new Ok(value);
        return result;
    }

    /**
     *  Maps a `Result<T, E>` to `U` by applying a function to a contained `Ok` value,
     *  or a `fallback` function to a contained `Err` value.
     *  This function can be used to unpack a successful result while handling an error.
     *
     *  @template   U
     *  @param  {!function(E):U}    fallback
     *  @param  {!function(T):U}    selector
     *  @return {U}
     */
    mapOrElse (fallback, selector) {
        if (!this._isOk) {
            const r = fallback(this._e);
            return r;
        }

        const r = selector(this._v);
        return r;
    }

    /**
     *  Maps a `Result<T, E>` to `Result<T, F>` by applying a function `mapFn<E, F>`
     *  to an contained `Err` value, leaving an `Ok` value untouched.
     *
     *  This function can be used to pass through a successful result while handling an error.
     *
     *  @template   U
     *  @param  {!function(E):F}    op
     *  @return {!Result<T, F>}
     */
    mapErr (op) {
        if (this._isOk) {
            // cheat to escape from a needless allocation.
            return this;
        }

        const value = op(this._e);
        const result = new Err(value);
        return result;
    }

    /**
     *  Returns `res` if the result is `Ok`, otherwise returns the `Err` value of self.
     *
     *  @template   U
     *  @param  {!Result<U, E>} res
     *  @return {!Result<U, E>}
     */
    and (res) {
        if (this._isOk) {
            return res;
        } 
		else {
            // cheat to escape from a needless allocation.
            return this;
        }
    }

    /**
     *  Calls `op` if the result is `Ok`, otherwise returns the `Err` value of self.
     *  This function can be used for control flow based on result values.
     *
     *  @template   U
     *  @param  {!function(T):!Result<U, E>} op
     *  @return {!Result<U, E>}
     */
    andThen (op) {
        if (!this._isOk) {
            // cheat to escape from a needless allocation.
            return this;
        }

        const mapped = op(this._v);
        const isResult = mapped instanceof Result;
        if (!isResult) {
            throw new TypeError("Result<T, E>.andThen()' param `op` should return `Result<U, E>`.");
        }

        return mapped;
    }

    /**
     *  Returns `res` if the result is `Err`, otherwise returns the `Ok` value of self.
     *
     *  @template   F
     *  @param  {!Result<T, F>} res
     *  @return {!Result<T, F>}
     */
    or (res) {
        if (this._isOk) {
            // cheat to escape from a needless allocation.
            return this;
        } 
		else {
            return res;
        }
    }

    /**
     *  Calls `op` if the result is `Err`, otherwise returns the `Ok` value of self.
     *  This function can be used for control flow based on result values.
     *
     *  @template   F
     *  @param  {!function(E):!Result<T, F>} op
     *  @return {!Result<T, F>}
     */
    orElse (op) {
        if (this._isOk) {
            // cheat to escape from a needless allocation.
            return this;
        }

        const mapped = op(this._e);
        const isResult = mapped instanceof Result;
        if (!isResult) {
            throw new TypeError("Result<T, E>.orElse()' param `op` should return `Result<T, F>`.");
        }

        return mapped;
    }

    /**
     *  Return the inner `T` of a `Ok(T)`.
     *
     *  @return {T}
     *
     *  @throws {TypeError}
     *      Throws if the self is a `Err`.
     */
    unwrap () {
        return this.expect('called `unwrap()` on a `Err` value');
    }

    /**
     *  Return the inner `E` of a `Err(E)`.
     *
     *  @return {E}
     *
     *  @throws {TypeError}
     *      Throws if the self is a `Ok`.
     */
    unwrapErr () {
        if (this._isOk) {
            throw new TypeError('called `unwrapErr()` on a `Ok` value');
        } 
		else {
            return this._e;
        }
    }

    /**
     *  Unwraps a result, return the content of an `Ok`. Else it returns `optb`.
     *
     *  @param  {T} optb
     *  @return {T}
     */
    unwrapOr (optb) {
        if (this._isOk) {
            return this._v;
        } 
		else {
            return optb;
        }
    }

    /**
     *  Unwraps a result, returns the content of an `Ok`.
     *  If the value is an `Err` then it calls `op` with its value.
     *
     *  @param  {!function(E):T}    op
     *  @return {T}
     */
    unwrapOrElse (op) {
        if (this._isOk) {
            return this._v;
        }

        const recovered = op(this._e);
        return recovered;
    }

    /**
     *  Return the inner `T` of a `Ok(T)`.
     *
     *  @param  {string}    message
     *  @return {T}
     *
     *  @throws {TypeError}
     *      Throws the passed `message` if the self is a `Err`.
     */
    expect (message) {
        if (this._isOk) {
            return this._v;
        } 
		else {
            throw new TypeError(message);
        }
    }

    /**
     *  The destructor method inspired by Rust's `Drop` trait.
     *  We don't define the object's behavior after calling this.
     *
     *  @param  {function(T)=}  destructor
     *      This would be called with the inner value if self is `Ok<T>`.
     *  @param  {function(E)=}  errDestructor
     *      This would be called with the inner value if self is `Err<E>`.
     *  @return {void}
     */
    drop (destructor, errDestructor) {
        if (this._isOk) {
            if (typeof destructor === 'function') {
                destructor(this._v);
            }
            this._v = null;
        } 
		else {
            if (typeof errDestructor === 'function') {
                errDestructor(this._e);
            }
            this._e = null;
        }
        //Object.freeze(this);
    }
}

class Ok extends Result {
	constructor (v) {
		super (true, v, undefined);
	}
}

class Err extends Result {
	constructor (e) {
		super (false, undefined, e);
	}
}

// /RUST-LIKE DATA TYPES
// ////////////////////////////////////////////////////////





// /BASE
// ////////////////////////////////////////////////////////


// ///////////////////////////////////////////////////////////////////////// //
// MultiInheritance 

// Class for creating multi inheritance.
class MultiInheritanc extends Class {
    constructor (..._bases) {
        // Copies the properties from one class to another
        function cloneInternal (_target, _source) {
                for (let key of Reflect.ownKeys(_source)) {
                    if (key !== "constructor" && key !== "prototype" && key !== "name") {
                        let desc = Object.getOwnPropertyDescriptor(_source, key);
                        Object.defineProperty(_target, key, desc);
                    }
                }
        }

		class Classes {
			constructor(..._args) {
				var index = 0;

				for (let b of /*this.base*/ _bases) {
					let obj = new b(_args[index++]);
   					cloneInternal (this, obj); 
				}
			}

			// The base classes
            // obsolete?
  			get base() { 
                return _bases; 
            }
		}

		// Copy over properties and methods
		for (let base of _bases) {
   			cloneInternal (Classes, base);
   			cloneInternal (Classes.prototype, base.prototype);
		}

		return Classes;
    }
}

// /BASE
// /////////////////////////////////////////////////////////////////////////////////////////////// //


// ////////////////////////////////////////////////////////////////////////////////////////////// //
// CREATIONAL DESIGN PATTERNS

// /////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Singleton Pattern

/*
class Singleton extends Class {

  static instance;

  constructor () {
    if (instance) {
      return instance;
    }

    this.instance = this;
  }

}
*/
// ////////////////////////////////////////////////////////////////////////////////////////////// //
// Abstract Factory

class AbstractProduct extends Class {
    constructor () {
        super ();
    }
}

/* IMPLEMENT in your own Class
class ConcreteProduct extends AbstractProduct {
    constructor(material) {
        //facade.log("Product class created");
        this.material = material
    }

}
*/

class AbstractFactory extends Class {
    constructor () {
        super ();
    }

    /* declare in your own class

    createFactory (factory) {
        return new factory ();
    }

    factoryMethod (product) {
        return new product ();
    }
    */

}

// //////////////////////////////////////////////////////////////////////////////////////// //
// Builder Pattern

class Director extends Class {
    constructor () {
        super ();
    }

}

class Builder extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class
    
    buildPart () {

    }
    */
}


// /////////////////////////////////////////////////////////////////////////////////////////// //
// Prototype Pattern

class Prototype extends Class {
    constructor () {
        super ();
    }

    setFeature(key, val) {
        this[key] = val
    }

    clone (){
        //facade.log('custom cloning function')
        let clone = new Prototype();
        let keys = Object.keys(this);

        keys.forEach(k => clone.setFeature(k, this[k]));

        //facade.log("ConcretePrototype1 cloned");
        return clone;

    }
}

// ///////////////////////////////////////////////////////////////////////////////////////////////// //
// Adapter Pattern

class Target extends Class {
    constructor(/*type*/) {
        super ();
        /*
        let result

        switch(type) {
            case 'adapter':
                result = new Adapter()
                break
            default:
                result = null
        }
        return result
        */
    }

    /* IMPLEMENT in your own Class
    doOperation () {

    }
    */
}

class Adaptee extends Class {
    constructor () {
        super ();
    }

    /* IMPLEMENT in your own Class
    SpecificRequest () {
        facade.log('Adaptee request')
    }
    */
}

class Adapter extends Adaptee {

    constructor() {
        super();
        //facade.log('Adapter created')
    }

    /* IMPLEMENT in your own Clas
    Request (){
        return this.SpecificRequest()
    }
    */
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Bridge Pattern

class BridgeImplementation extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class
    operate (){
    }
    */
}


class BridgeAbstraction extends Class {
    constructor () {
        super ();
    }
    /* IMPLEMENT in your own Class
    Operate (){
        this.imp.Operate();
    }
    */
}


// //////////////////////////////////////////////////////////////////////////////////////////////// //
// Composite Pattern

class Component extends Class {
    constructor () {
        super ();
        //this.container = container;
    }

	addElement (name, element) {
		this.elements[name] = element;		
	}

   	removeElement (name) {
		delete this.elements[name];
	}

    on (selector, eventName, handlerMethod) {
		var me = this; //Tricky! Very Tricky!!
        const elList = document.querySelectorAll(selector);
	
        /*
        for (let i = 0; i < elList.length; i++) {
        	elList[i].addEventListener(eventName, handlerMethod.call(me, eventArg);
        }
        */
      
        Array.prototype.forEach.call(elList, function(el) {
			el.addEventListener (eventName, /*async*/ function (eventArg) {
				/*await*/ handlerMethod.call (me, eventArg);
			});	

        });

    }

    off (selector, eventName, eventHandler, useCapture) {
        var element = document.querySelectorAll(selector);

        Array.prototype.forEach.call(element, function(el) {
            el.removeEventListener(eventName, eventHandler, useCapture);
        });
    }

    offOn(selector, eventName, eventHandler, useCapture) {
        this.off(selector, eventName, eventHandler, useCapture);
        this.on(selector, eventName, eventHandler);
    }

    // on (selector, eventName, handlerMethod) {
	// 	var me = this.me; //Tricky! Very Tricky!!
    //     const elList = document.querySelectorAll(selector);

    //     Array.prototype.forEach.call(elList, function(el) {
    //         el.addEventListener(eventName, eventHandler);
    //     });

    // }
    // off (selector, eventName, eventHandler, useCapture) {
    //     var element = document.querySelectorAll(selector);
    //     Array.prototype.forEach.call(element, function(el) {
    //         el.removeEventListener(eventName, eventHandler, useCapture);
    //     });
    // }

    // offOn(selector, eventName, eventHandler, useCapture) {
    //     this.off(selector, eventName, eventHandler, useCapture);
    //     this.on(selector, eventName, eventHandler);
    // }
    // resetErrorView (formSelector) {
	// 	//for (const [k, v] of Object.entries (formError)) {
	// 	$ (formSelector).find ("[data-validation]").each (function () {
	// 		var $field = $ (this);

	// 		$ ("#"+$field.attr ("id")+"_error").attr ("data-content", "");
	// 		//$field.removeClass ("alert-warning");

	// 		// Added By Istiyak
	// 		$ ("#"+$field.attr ("id")+"_error").addClass ("d-none");
	// 		$field.removeClass ("is-invalid");
			

	// 	});
	// }

	// renderErrorView (formError) {
	// 	for (const [k, v] of Object.entries (formError)) {
	// 		var l = "<ul>";
	// 		for (var i = 0; i < v.length; i++) {
	// 			l += "<li>" + formError[k][i] + "</li>";
	// 		}
	// 		l += "</ul>";
	// 		let labelId = $ ("#" + k + "_error").attr ("data-content", l);
	// 		// $ ("#" + k + "_error").addClass ("alert-warning");

	// 		// Added By Istiyak
	// 		$ ("#" + k + "_error").removeClass ("d-none");
	// 		$ ("#" + k).addClass ("is-invalid");
	// 	}

	// 	return this;
	// }


	// validate (formSelector, formError) {
	// 	return app.locateService (FormValidator).validate (formSelector, formError);
	// }


    ////// TODO  needs refactoring
    validate (formSelector, formError) {
		return app.locateService (FormValidator).validate (formSelector, formError);
	}


	resetErrorView (formSelector) {
		//for (const [k, v] of Object.entries (formError)) {
		$ (formSelector).find ("[data-validation]").each (function () {
			var $field = $ (this);

			$ ("#"+$field.attr ("id")+"_error").attr ("data-content", "");
			$field.removeClass ("alert-warning");

			// Added By Istiyak
			$ ("#"+$field.attr ("id")+"_error").addClass ("hidden");
			$field.removeClass ("is-invalid");
			

		});
	}

	renderErrorView (formError) {
        let c = 0
        for (const [k, v] of Object.entries (formError)) {
			var l = "<ul class='list-disc text-left pl-10'>";
			for (var i = 0; i < v.length; i++) {
				l += "<li>" + formError[k][i] + "</li>";
			}
			l += "</ul>";
			//let labelId = $ ("#" + k + "_error").attr ("data-content", l);
			// $ ("#" + k + "_error").addClass ("alert-warning");

			// Added By Istiyak
            //let element = 
            if(document.getElementById(`${k}_label`).children[0].children[0].children[2]){
                
            }else{
			document.getElementById(`${k}_label`).children[0].children[0].children[1].insertAdjacentHTML("afterend" , l)}
			//$ ("#" + k).addClass ("is-invalid");
      //$ ("#" + k).addClass ("is-invalid");
       
      
		}

		return this;
	}



}

class Composite extends Component {
    constructor() {
        super();
        this.components = {};
        //facade.log('Composite created')
    }
	/* //Inherited:
	addComponent (name, component) {
		this.components[name] = component;		
	}

   	removeComponent (name) {
		delete this.components[name];
	}
	*/
}


// ///////////////////////////////////////////////////////////////////////////////////////////////////// //
// Decorator Pattern

class Decorator extends Class {
    constructor(obj) {
        super()
        this.obj = obj
        //facade.log('Decorator created')
    }

    /* IMPLEMENT in your own Class
    doOperation (){
        //this.component.doOperation()
    }
    */
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Facade Pattern

class Facade extends Class {
    constructor(...classes) {
        super ();
        for (i = 0; i < classes.length; i++) {
            this[classes[i]] = new classes[i]; 
        }
    }
    /* DECLARE in your own Class
    operation () { 
        class1.method3 ();
        class8.method4 ();
        ...
    }
    */
}


// ////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Flyweight Pattern

class FlyweightFactory extends Class {
    constructor() {
        super ();
        this.flyweights = {};
        //facade.log('FlyweightFactory created')
    }

    GetFlyweight (key){
        if(this.flyweights[key]){
            return this.flyweights[key];
        }
        else{
            this.flyweights[key] = new ConcreteFlyweight(key);
            return this.flyweights[key];
        }
    }

    
    /* IMPLEMENT in your own Class
    CreateGibberish (keys) {
        return new UnsharedConcreteFlyweight(keys, this)
    }
    */
}

class Flyweight extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class
    doOperation (extrinsicState){  

    }
    */
}


// ///////////////////////////////////////////////////////////////////////////////////////////// //
// Proxy Pattern

class ProxyTarget extends Class {
    constructor() {
        super()
        //facade.log('Proxy created')
    }

    /* IMPLEMENT in your own Class
    doOperation (args){
        //this.realSubject = new RealSubject(); //You'll do this on your own proxy class
        //this.realSubject.Request(); //You'll do this on your own proxy class
    }
    */
}


class Proxy extends ProxyTarget {
    constructor() {
        super()
        //facade.log('Proxy created')
    }

    /* IMPLEMENT in your own Class
    doOperation (args){
        //this.realSubject = new RealSubject(); //You'll do this on your own proxy class
        //this.realSubject.Request(); //You'll do this on your own proxy class
    }
    */
}


// CREATIONAL DESIGN PATTERNS
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////// //


// //////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// BEHAVIORAL DESIGN PATTERNS

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Chain of Responsibility Pattern

class Chain extends Class {
    constructor() {
        super ();
        this.succssor = null;
    }

    /* DECLARE in your own Class    
    doOperation () {
    }
    */
    setSuccessor (successor) {
        this.successor = successor
    }

}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Command Pattern

class CommandInvoker extends Class {
    constructor() {
        super ();
        //facade.log('Invoker created')
    }

    StoreCommand(command) {
        this.command = command
    }
}

class Command extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    doOperation () {
    }
    */
}

class CommandReceiver extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    doOperation () {
        //facade.log('Receiver Action')
    }
    */
}


// ///////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Interpreter Pattern

class InterpreterContext extends Class {
    constructor(input) {
        super ();

        this.input = input
        this.index = 0
        this.output = null
    }

    /* DECLARE in your own Class    
    Lookup(expr) {
        //return this.
    }
    */
}


class InterpreterExpression extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    Interpret (context){
    }
    */
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Iterator Pattern

class Iterator extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    First (){
    }

    Next (){
    }

    IsDone (){
    }

    CurrentItem (){
    }
    */
}

class IteratorAggregate extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    CreateIterator (){
    }
    */
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Mediator Pattern

class Mediator extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    ColleagueChanged(colleague) {

    }
    */
}

class MediatorColleague extends Class {
    constructor () {
        super ();
    }

    /* IMPLEMENT in your own Class    
    Changed() {
        this.mediator.ColleagueChanged(this)
    }
    */
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Mementor Pattern

class MementoOriginator extends Class {
    constructor(state) {
        super ();

        //facade.log('Originator created')
        this.state = state;
        //facade.log('State= ' + this.state)
    }

    SetMemento (Memento){
        this.state = Memento.GetState()
        //facade.log('State= ' + this.state)
    }

    CreateMemento (state){
        return new Memento(state);
    }
}

class Memento extends Class {
    constructor(state) {
        super ();

        this.state = state
        facade.log('Memento created. State= ' + this.state)
    }

    GetState (){
        return this.state;
    }

    SetState (state){
        this.state = state;
    }
}

class MementoCaretaker extends Class {
    constructor() {
        super ();
        //facade.log('Caretaker created')
        this.mementos = []
    }

    AddMemento(memento) {
        //facade.log('Caretaker AddMemento')
        this.mementos.push(memento)
    }

    SetMemento() {
        return this.mementos[this.mementos.length-1]
    }
}

// ////////////////////////////////////////////////////// //
class Service extends Class {
	constructor (config) {
		super ();
	}
}

class Logger extends Service {
	constructor (config) {
		super ();
	}

	log (who, msg) {
		console.log ("[" + who + "] :: " + msg);
	}
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Observer Pattern

class Observable extends Service {
    constructor(config) {
        super (config);
        //this.observers = [];
        this.observers = {};
    }

    publish (/*sender,*/ msg){
        if (typeof this.observers[msg] === 'undefined')
			this.observers[msg] = [];
		return this;
	}

	unpublish (/*sender,*/ msg) {
        if (typeof this.observers[msg] !== 'undefined')
			delete this.observers[msg];
		return this;
	}

    subscribe (msg, observer){
        //this.observers.push(observer);
        if (typeof this.observers[msg] === 'undefined')
			this.observers[msg] = [];

		this.observers[msg].push (observer);
		//facade.log('Observer attached')
		return this;
    }

    unsubscribe (msg, observer){
        for(var i in this.observers[msg])
            if(this.observers[i] === observer)
                this.observers.splice(i, 1)
		return this;
    }

    notify (/*sender,*/ msg) {
        //facade.log('Subject Notify')
		//this.publish (msg); //safety

        for(var i in this.observers[msg]){
            this.observers[msg][i] (msg);
        }
		return this;
    }
}

class Observer extends Class {
    constructor () {
        super ();
    }

    /* IMPLEMENT in your own Class
    receive (msg){
        ...
    }
    */
}

// /////////////////////////////////////////////////////////////////////////////////////////////////// //
// State Pattern

class StateContext extends Context {
    constructor () {
        super ();
    }
    /* IMPLEMENT in your own Class    
    constructor(state) {
        switch(state) {
            case "A":
                this.state = new ConcreteStateA()
                break
            case "B":
                this.state = new ConcreteStateB()
                break
            default:
                this.state = new ConcreteStateA()
        }
    }

    doOperation (){
        this.state.doOperation(this);
    }
    */
}

class State extends Class {
    constructor () {
        super ();
    }

}


// ////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Strategy Pattern

class StrategyContext extends Context {
    /* IMPLEMENT in your own Class    
    constructor(type){
        switch(type) {
            case "A":
                this.strategy = new ConcreteStrategyA()
                break
            case "B":
                this.strategy = new ConcreteStrategyB()
                break
            default:
                this.strategy = new ConcreteStrategyA()
        }
    }
    ContextInterface (){
        this.strategy.doOperation ()
    }
    */
}

class Strategy extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own Class    
    doOperation (){
    }
    */
}


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Template Method pattern

class AbstractTemplate extends Class {
    constructor () {
        super ();
    }

    /* IMPLEMENT in your own Class 
    doOpration (){
        //this.PrimitiveOperation1();
        //this.PrimitiveOperation2();
    }
    PrimitiveOperation1 (){
    }

    PrimitiveOperation2 (){
    } 
    */ 
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Visitor Pattern

class Visitor extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own class
    VisitConcreteElementA (ConcreteElementA){
    }

    VisitConcreteElementB (ConcreteElementB){
    }  
    */

}

class VisitorElement extends Class {
    constructor () {
        super ();
    }

    /* DECLARE in your own class
    Accept (visitor){
    }
    */
}

// /////////////////////////////////////////////////////////////////////////////////////////////// //
// PubSub (Publisher, Subscriber) Pattern

class Publisher extends Class {

	constructor() {
        super ();

		this.events = {};
	}

	transmitNotification (ev, obj) {

		let e = this.events[ev];

		if(!e) {
			return;
		}

		let arg = arguments;

		if(this.async) {

		}
		e.forEach(fn => fn.apply(this, [obj]));

	}

	subscribe(ev, func) {
  
  		let _this = this;
    
		if(!this.events[ev]) {
			this.events[ev] = [];
		}

		const index = this.events[ev].push(func) -1;

		return {
    		_index: index,
      		ev: ev,
      		remove: () => _this.remove(ev, index)
    	}
	}

	unsubscribe(ev) {

		let e = this.events[ev];

		if(e) {
			delete this.events[ev];
			return true;
		}

		return false;

	}

	getEvents() {
		return this.events;
	}

}

class Subscriber extends Class {
    constructor () {
        super ();
    }

    /* IMPLEMENT in your own Class
    onEvent () {

    }
    */
}


// /////////////////////////////////////////////////////////////////////////////////////////////////////
// IOC

class Dependent extends Class {
    /* IMPLEMENT in your own Class
    constructor (...dependencies) {

    }

    doOperation () {
        .
        .
        .
        dependencyN.doOperation ();
        .
        .
        ...
    }
    */


}

class Dependency extends Class {
    /* IMPLEMENT in your own Class
    constructor (...dependencies) {

    }
    */

    /* DECLARE in your own Class
    doOperation () {

    }
    */

}

class DependencyInjectionContainer extends Class {
    constructor () {
        this.dependencies = new Map();
        this.singletons = new Map();
    }

    normalizeClass(clazz) {
        if(typeof clazz == 'string') {
            // TODO: Actually resolve the class from the string name that
            // was provided to us.
        } 
        else if(typeof clazz == 'function') {
            return clazz;
        } 
        else {
            throw new Error('Unable to resolve the dependency name to the class.');
        }
    }

    registerInstance(clazz, instance) {
        if(typeof instance != 'object' && typeof instance != 'function') {
            throw new Error('The argument passed was an invalid type.');
        }

        clazz = this.normalizeClass(clazz);

        this.singletons.set(clazz, instance);
    }

    registerDependencies(clazz, deps) {
        this.dependencies.set(clazz, deps);
    }

    registerAsSingleton(clazz) {
        if(!this.singletons.has(clazz)) {
            this.singletons.set(clazz, null);
        }
    }

    resolve(clazz) {
        clazz = this.normalizeClass(clazz);

        // If the class being injected is a singleton, handle it separately
        // since instances of it are cached.
        if(this.singletons.has(clazz)) {
            return this.resolveSingleton(clazz);
        } 
        else {
            return this.resolveSingleInstance(clazz);
        }
    }

    resolveAll(...classes) {
        return classes.map(this.resolve);
    }

    resolveSingleton(clazz) {
        if(this.singletons.get(clazz) === null) {
            this.singletons.set(clazz, this.resolveSingleInstance(clazz));
        }

        return this.singletons.get(clazz);
    }

    resolveSingleInstance(clazz) {
        // Check and see if there are any dependencies that need to be injected
        var deps = this.resolveAll(...(this.dependencies.get(clazz) || []));

        // Apply the dependencies and create a new instance of the class
        return new clazz(...deps);
    }
}

// /DI
// ////////////////////////////////////////////////////////////////////////////////////////////////// //

class GlobalErrorHandler extends Service {
	constructor (config) {
		super (config);
		//DEBUGGING this.setCatcher ();
	}

	setCatcher () {
		window.onerror = function (msg, url, lineNo, columnNo, error) {
			var string = msg;
			var substring = "script error";
			var message = [
			/*'Error: ' +*/ msg,
			'URL: ' + url,
			'Line: ' + lineNo,
			'Column: ' + columnNo,
			//'Error object: ' + JSON.stringify(error)
			].join('<br/>');

			//alert ("Alas!");

			$(document).Toasts('create', {
				class: 'bg-danger', 
				title: "Application Error Handler",
				subtitle: "",
				autohide: false,
				delay: 2000,
				body: message,
			});

			return true;
		};


		window.onunhandledrejection = function (ex) {
			$(document).Toasts('create', {
				class: 'bg-danger', 
				title: "Application Error Handler",
				//subtitle: "",
				autohide: true,
				delay: 2000,
				body: ee.reason,
			});

			return true;
		};


		/*
		window.addEventListener("error", function (e) {
			//alert ("Alas!");
		alert("Error occurred: " + e.error.message);
		return false;
		})
		*/		

	}
}

class DependencyManager extends Class {
    constructor() {
        super ();
        this.instances = {};
        this.factories = {};
    }


    registerInstance = (instanceName, instance) => {
        //let instanceName = instance.constructor.name;
        this.instances[instanceName] = instance;
		return this;
    }


    xinstantiateAndRegister = (concreteClass, ...args) => {
		//this.instances[name] = instance;
		
		let instanceName = concreteClass.name;
		//this.instances[name] = {};
		this.instances[instanceName] = new concreteClass(...args);
		return this;
	}

    /* IMPLEMENTATION PENDING
    registerFactory = (name, factory) => {
        this.factories[name] = factory;
		return this;
    }
    */

    requireInstance = (instanceName) => {
        //let instanceName = concreteClass.name;
        /* IMPLEMENTATION PENDING
        if (!this.instances[instanceName]) {
            const factory = this.factories[instanceName];
            this.instances[instanceName] = factory && this.inject(factory);
            if (!this.instances[instanceName]) throw new Error(`Cannot find module ${instanceName}`);
        }
        */
        if (!this.instances[instanceName]) {
            throw new Error(`Cannot find ${instanceName} instance`);
        }
        return this.instances[instanceName];
    }

    registerAndRequireInstance = (instanceName, instance) => {
        //let instanceName = instance.constructor.name;
        this.registerInstance (instanceName, instance);
        return this.instances[instanceName];
    }

    /* IMPLEMENTATION PENDING
    inject = (factory) => {
        const fnArgs = app.parse(factory).args
            .map(instance => this.get(instance));
        return factory.apply(null, fnArgs);
    }
    */
}

// /IOC
// /////////////////////////////////////////////////////////////////////////////////////////////////////


// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// MVC

class Model extends Class {
    constructor () {
        super ();
    }

}

class View extends Class  {
    constructor () {
        super ();
		this.te = new TemplateEngine ();
		this.compiledTemplates = {}
	}

	addTemplate (name, template) {
		this.compiledTemplates[name] = this.te.compileTemplate (template);
		return this; 
	}

}

class Controller extends Class {
    constructor () {
		//this.te = new TemplateEngine ();
        super ();
		/*
        this.component = component;

        this.es = component.elements;
        this.ms = component.models;
        this.vs = component.views;
        this.cs = component.controllers;
		*/
    }

    render (view, compiledTemplate, modelData, el) {
        view.te.applyTemplate (view.compiledTemplates[compiledTemplate], modelData, el)
    }
}


// /MVC
// ////////////////////////////////////////////////////////////////////////////////////////////////// //

// ////////////////////////////////////////////////////////////////////////////////////////////////// //
// ACTOR SYSTEM
/*
class Actor extends Class () {
	constructor () {
		super ();
	}
}
*/
// /ACTOR SYSTEM
// ////////////////////////////////////////////////////////////////////////////////////////////////// //

