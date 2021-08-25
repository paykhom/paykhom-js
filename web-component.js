'use strict'

// ////////////////////////////////////////////////////////
// WEB ELEMENTS
PaykhomJs.El = PaykhomJs.El || {};

class WebElementTrait extends Class {
	constructor () {
		super ();
		//BUG : This constructor is not being called.
	}


	connectedCallback () {
		this.uponBeforeRender && this.uponBeforeRender (); //must be a descendant method. don't define here
		
		//this.onRenderBegin ();
		//let content = this.render (); //must be a descendant method. don't define here
		let accumulator = '';
		for (let c of this.uponRender()) {
			accumulator += c;
		}
		//return accumulator;

		if (accumulator.length > 0) {
			this.innerHTML = accumulator; 
		}
		
		//this.onRenderEnd ();
		this.uponAfterRender && this.uponAfterRender (); //must be a descendant method. don't define here
	}

	/*
	initialize () {
		let self = this;
		
		this.style = null; //construction && construction.style && construction.style;
		this.prop = null; //construction && construction.style && construction.style;
		this.state = null; //construction && construction.style && construction.style;
		this.el = null; //construction && construction.style && construction.style;
		this.template = null; //construction && construction.style && construction.style;
		this.style = null; //construction && construction.style && construction.style;

		//let elements = this.querySelectorAll("[id]");
		this.querySelectorAll("[id]").elements.forEach(function(el) {
			self.el[item.id] = el;
		});
		return this;
	}
	*/

	/*
	addElementArr(selectorArr) {
		selectorArr.forEach (function (selector) {
			this.addElement (selector);
		});

		return this;
	}

	removeElementArr(name) {
		delete this.el;
		return this;
	}
	*/
	

	
	uponReady () {
		let elArr = this.querySelectorAll('[id]');
		for (let i = 0; i < elArr.length; ++i) {
			this.el[elArr[i].id] = elArr[i];
		}	
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

class WebElement extends Mixin (HTMLElement, WebElementTrait /*, Ygte*/) {
	constructor () {
		super ();
		this.el = {};
		this.state = {};
		//this.initialize ();
	}

	uponReady () {
		super.uponReady ();
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

	addEventHandler (el, ev, /*instance,*/ handler, self = this) {
		if (el instanceof Array) {
			for (let j = 0; i < el.length; i++) {
				if (typeof el[j] === "string") {
					let elArr = document.querySelectorAll (el[j]);
					for (let i = 0; i < elArr.length; i++) {
						elArr[i].addEventListener (ev, function (eventMsg) {
							handler.call (self, eventMsg);
						});	
					}
				}
				else if (typeof el[j] === "object") {
					el[j].addEventListener (ev, function (eventMsg) {
						handler.call (self, eventMsg);
					});	
				}
				else {
					throw new Exception ("Unwanted paramter el");
				}
			}
		}
		else {
			if (typeof el === "string") {
				let elArr = document.querySelectorAll (el);
				for (let i = 0; i < elArr.length; i++) {
					elArr[i].addEventListener (ev, function (eventMsg) {
						handler.call (self, eventMsg);
					});	
				}
			}
			else if (typeof el === "object") {
				el.addEventListener (ev, function (eventMsg) {
					handler.call (self, eventMsg);
				});	
			}
			else {
				throw new Exception ("Unwanted paramter el");
			}
		}
		return this;
	}

	addEventHandlerArr (arr) {
		var self = this;
		/*
		for (const [el, handlerDict] of Object.entries(eventDict)) {
			//this.templates[name] = this.te.compileTemplate (value);		
			for (const [ev, handler] of Object.entries(handlerDict))
				this.eventListenerAdd(el, ev, handler);
		}
		*/
		arr.forEach (function (e) {
			//self.addEventHandler (e[0], e[1], e[2], e[3]);
			self.addEventHandler (e[0], e[1], e[2], e[3]);
		});
		return this;
	}


}
PaykhomJs.El.WebElement = WebElement;




class WebScriptElement extends Mixin (HTMLScriptElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}

}

class WebSelectElement extends Mixin (HTMLSelectElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}

}

/* Not Working
class WebShadowElement extends Mixin (HTMLShadowElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}
}
*/

class WebSlotElement extends Mixin (HTMLSlotElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebSourceElement extends Mixin (HTMLSourceElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebSpanElement extends Mixin (HTMLSpanElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebStyleElement extends Mixin (HTMLStyleElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebTableCaptionElement extends Mixin (HTMLTableCaptionElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebTableCellElement extends Mixin (HTMLTableCellElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
		this.el = {};
	}

	uponReady () {
		super.uponReady ();
	}
}

class WebTableColElement extends Mixin (HTMLTableColElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}
}

class WebTableElement extends Mixin (HTMLTableElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}
}

class WebTableRowElement extends Mixin (HTMLTableRowElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}
}

class WebTableSectionElement extends Mixin (HTMLTableSectionElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}
}

class WebTemplateElement extends Mixin (HTMLTemplateElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebTextAreaElement extends Mixin (HTMLTextAreaElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebTimeElement extends Mixin (HTMLTimeElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebTitleElement extends Mixin (HTMLTitleElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebTrackElement extends Mixin (HTMLTrackElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebUListElement extends Mixin (HTMLUListElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebUnknownElement extends Mixin (HTMLUnknownElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebVideoElement extends Mixin (HTMLVideoElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebAnchorElement extends Mixin (HTMLAnchorElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebAreaElement extends Mixin (HTMLAreaElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebAudioElement extends Mixin (HTMLAudioElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebBaseElement extends Mixin (HTMLBaseElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebBaseFontElement extends Mixin (HTMLBaseFontElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebBodyElement extends Mixin (HTMLBodyElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebBRElement extends Mixin (HTMLBRElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebButtonElement extends Mixin (HTMLButtonElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebCanvasElement extends Mixin (HTMLCanvasElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebCollection extends Mixin (HTMLCollection) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebContentElement extends Mixin (HTMLContentElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebDataElement extends Mixin (HTMLDataElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebDataListElement extends Mixin (HTMLDataListElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebDetailsElement extends Mixin (HTMLDetailsElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebDialogElement extends Mixin (HTMLDialogElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebDivElement extends Mixin (HTMLDivElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebDListElement extends Mixin (HTMLDListElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebDocument extends Mixin (HTMLDocument) { 
	constructor () {
		super ();
	}

}

class WebEmbedElement extends Mixin (HTMLEmbedElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebFieldSetElement extends Mixin (HTMLFieldSetElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebFontElement extends Mixin (HTMLFontElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}


class WebFormElement extends Mixin (HTMLFormElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebFrameSetElement extends Mixin (HTMLFrameSetElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebHeadElement extends Mixin (HTMLHeadElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebHeadingElement extends Mixin (HTMLHeadingElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebHRElement extends Mixin (HTMLHRElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebWebElement extends Mixin (HTMLHtmlElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}


class WebIFrameElement extends Mixin (HTMLIFrameElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebImageElement extends Mixin (HTMLImageElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebInputElement extends Mixin (HTMLInputElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebKeygenElement extends Mixin (HTMLKeygenElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebLabelElement extends Mixin (HTMLLabelElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebLegendElement extends Mixin (HTMLLegendElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebLIElement extends Mixin (HTMLLIElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebLinkElement extends Mixin (HTMLLinkElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebMapElement extends Mixin (HTMLMapElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebMarqueeElement extends Mixin (HTMLMarqueeElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebMediaElement extends Mixin (HTMLMediaElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebMenuElement extends Mixin (HTMLMenuElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebMenuItemElement extends Mixin (HTMLMenuItemElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebMetaElement extends Mixin (HTMLMetaElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebMeterElement extends Mixin (HTMLMeterElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebModElement extends Mixin (HTMLModElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebObjectElement extends Mixin (HTMLObjectElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebOListElement extends Mixin (HTMLOListElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebOptGroupElement extends Mixin (HTMLOptGroupElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebOptionElement extends Mixin (HTMLOptionElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

/* NOT WORKING
class WebOrForeignElement extends Mixin (HTMLOrForeignElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}
*/

class WebOutputElement extends Mixin (HTMLOutputElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebParagraphElement extends Mixin (HTMLParagraphElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebParamElement extends Mixin (HTMLParamElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebPictureElement extends Mixin (HTMLPictureElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebPreElement extends Mixin (HTMLPreElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebProgressElement extends Mixin (HTMLProgressElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}

class WebQuoteElement extends Mixin (HTMLQuoteElement, WebElementTrait, Ygte) { 
	constructor () {
		super ();
	}

}


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class WebElementary extends Component {
	constructor () {
		super ();
	}

	whatToNameIt() {
        /*
        forEach (selector, callbackFn) {
            var elements = document.querySelectorAll(selector);
            Array.prototype.forEach.call(elements, callbackFn);
        }
        */
	}

	empty(el) {
		while (el.firstChild)
			el.removeChild(el.firstChild);
	}

	filter(selector, filterFn) {
		Array.prototype.filter.call(document.querySelectorAll(selector), filterFn);
	}

	height(el) {
		return parseFloat(getComputedStyle(el, null).height.replace("px", ""));
	}

	width(el) {
		return parseFloat(getComputedStyle(el, null).width.replace("px", ""));
	}

	index(el) {
		if (!el) return -1;
		var i = 0;
		do {
			i++;
		} while (el = el.previousElementSibling);
		return i;
	}
	matches(el, selector) {
		return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	}

	outerHeight(el) {
		var height = el.offsetHeight;
		var style = getComputedStyle(el);

		height += parseInt(style.marginTop) + parseInt(style.marginBottom);
		return height;
	}

	outerWidth(el) {
		var width = el.offsetWidth;
		var style = getComputedStyle(el);

		width += parseInt(style.marginLeft) + parseInt(style.marginRight);
		return width;
	}

	setHeight(el, val) {
		if (typeof val === "function") val = val();
		if (typeof val === "string") el.style.height = val;
		else el.style.height = val + "px";
	}

	siblings(el) {
		Array.prototype.filter.call(el.parentNode.children, function (child) {
			return child !== el;
		});
	}

	ready(fn) {
		if (document.readyState != 'loading') {
			fn();
		}
		else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	trigger(customEvent, data) {
		if (window.CustomEvent && typeof window.CustomEvent === 'function') {
			var event = new CustomEvent(customEvent, { detail: data });
		}
		else {
			var event = document.createEvent('CustomEvent');
			event.initCustomEvent(customEvent, true, true, data);
		}
		el.dispatchEvent(event);
	}

	triggerNative(customEvent) {
		// For a full list of event types: https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
		var event = document.createEvent('HTMLEvents');
		event.initEvent(customEvent, true, false);
		el.dispatchEvent(event);
	}

	parseHtml(html) {
		var tmp = document.implementation.createHTMLDocument();
		tmp.body.innerHTML = html;
		return tmp.body.children;
	}


	getAllPreviousSiblings(elem, filter) {
		var sibs = [];
		while (elem = elem.previousSibling) {
			if (elem.nodeType === 3) continue; // ignore text nodes
			if (!filter || filter(elem)) sibs.push(elem);
		}
		return sibs;
	}

	getAllNextSiblings(elem, filter) {
		var sibs = [];
		var nextElem = elem.parentNode.firstChild;
		do {
			if (nextElem.nodeType === 3) continue; // ignore text nodes
			if (nextElem === elem) continue; // ignore elem of target
			if (nextElem === elem.nextElementSibling) {
				if (!filter || filter(elem)) {
					sibs.push(nextElem);
					elem = nextElem;
				}
			}
		} while (nextElem = nextElem.nextSibling)
		return sibs;
	}

	closest(el, selector) {
		const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

		while (el) {
			if (matchesSelector.call(el, selector)) {
				return el;
			}
			else {
				el = el.parentElement;
			}
		}
		return null;
	}

	parentsUntil(el, selector, filter) {
		const result = [];
		const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

		// match start from parent
		el = el.parentElement;
		while (el && !matchesSelector.call(el, selector)) {
			if (!filter) {
				result.push(el);
			}
			else {
				if (matchesSelector.call(el, filter)) {
					result.push(el);
				}
			}
			el = el.parentElement;
		}
		return result;
	}

	selectorContains(selector, text) {
		var elements = document.querySelectorAll(selector);
		return Array.from(elements).filter(function (element) {
			return RegExp(text).test(element.textContent);
		});
	}

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
		
}


//
// ////////////////////////////////////////////////////////
