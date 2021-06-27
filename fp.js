'use strict';

const delay = time => new Promise(res=>setTimeout(res,time));
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// FUNCTIONAL PROGRAMMING DESIGN PATTERNS

var PaykhomJs = PaykhomJs || {};

/*
function toCamel (s = "") {
	let cs = s.replace(/([-_][a-z][0-9])/ig, ($1) => {
		return $1.toUpperCase()
		.replace('-', '')
		.replace('_', '');
	});
	return cs;
};
*/
const toCamel = (s) => {
	return s.replace(/([-_][a-z][0-9])/ig, ($1) => {
		return $1.toUpperCase()
			.replace('-', '')
			.replace('_', '');
	});
};

const snakeToCamel = (str = "") => {
	str = str.replace('#', '');
	return str.replace(
		/([-_][a-z])/g,
		(
			group) => group.toUpperCase()
				.replace('-', '')
				.replace('_', '')
	);
};

function stringToSlug(str) {
	str = str.replace(/^\s+|\s+$/g, ""); // trim
	str = str.toLowerCase();

	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove invalid chars
		.replace(/\s+/g, "-") // collapse whitespace and replace by -
		.replace(/-+/g, "-") // collapse dashes
		.replace(/^-+/, "") // trim - from start of text
		.replace(/-+$/, ""); // trim - from end of text

	return str;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

/*
implementation 1

function mixin(...mixins) {
	class Mix { }

	for (let mix of mixins) {
		mixinCopyProperties(Mix, mix);
		mixinCopyProperties(Mix.prototype, mix.prototype);
	}

	return Mix;
}

function mixinCopyProperties(target, source) {
	for (let key of Reflect.ownKeys(source)) {
		if (key !== "constructor" && key !== "prototype" && key !== "name") {
			let desc = Object.getOwnPropertyDescriptor(source, key);
			Object.defineProperty(target, key, desc);
		}
	}
}
*/


/*
implementation 2

You can use function mix to extend your classes like this:

class NewClass extends mixin(classA, classB [, classC, ...]){
  constructor(...args) {
    super(...args)

    // Your code here
  }
}

This function will automatically mix all your class in together and manage every Constructor for you. 
In other words, you're able to set your superclass as the first class.

class NewClass extends mixin(superclass, classA, [, classB, ...]){
  constructor(...args) {
    super(...args)

    // Your code here
  }
}


function mixin(...mixins) {
	class Mix {
		constructor(...args) {
			this.initialize && this.initialize(...args)
			for (let i in mixins) {
				const newMixin = new mixins[i](...args)
				copyProperties(this, newMixin)
				copyProperties(this.prototype, newMixin.prototype)
			}
		}
	}
	for (let i in mixins) {
		const mix = mixins[i]
		mixin2copyProperties(Mix, mix)
		mixin2copyProperties(Mix.prototype, mix.prototype)
	}


	return Mix
}


function mixin2copyProperties(target = {}, source = {}) {
	const ownPropertyNames = Object.getOwnPropertyNames(source)

	ownPropertyNames
		.filter(key => !/^(prototype|name|constructor)$/.test(key))
		.forEach(key => {
			const desc = Object.getOwnPropertyDescriptor(source, key)

			Object.defineProperty(target, key, desc)
		})
	;
}
*/

/*
implementation 3
*/
function Mixin(...mixins) {
	class Mix extends mixins[0] { 
		constructor (...args) {
			super (...args);
		}
	}
	let fnMixinCopyProperties = function mixin3CopyProperties(target, source) {
		for (let key of Reflect.ownKeys(source)) {
			if (key !== "constructor" && key !== "prototype" && key !== "name") {
				let desc = Object.getOwnPropertyDescriptor(source, key);
				Object.defineProperty(target, key, desc);
			}
		}
	}

	for (let mix of mixins) { //TODO: exclude mixins[0] from loop
		//mixin3CopyProperties(Mix, mix);
		//mixin3CopyProperties(Mix.prototype, mix.prototype);

		fnMixinCopyProperties (Mix, mix);
		fnMixinCopyProperties (Mix.prototype, mix.prototype);
	}

	return Mix;
}




// /FUNCTIONAL PROGRAMMING DESIGN PATTERNS
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
