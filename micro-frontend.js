'use strict';

// ////////////////////////////////////////////////////////
// WEB COMPONENT OBJECT MODEL
//


PaykhomJs.Com = PaykhomJs.Com || {};

class WebComponent extends Component {
	constructor(selector) {
		super();
		this.wc = {};
		this.el = {};
		this.dbc = new Dbc ();

		/* REWRITE LATER		
		this.te = new TemplateEngine(); //frameworks should not use app.locateService(...)...

		this.ts = this.templates = {};

		this.ms = this.models = {};
		this.vs = this.views = {};
		this.cs = this.controllers = {};
		*/

		//this.webComponents = {};




		/* 
		GOD DAMN - WE BROKE IT
		var that = this;
		this.selector = selector;
		that.elementAdd (selector);
		let e = document.querySelector (selector);
		var elements = document.querySelector (selector).querySelectorAll("[id]");
		elements.forEach(function(el) {
			that.elementAdd ("#"+el.id);
		});
		
		/GOD DAMN - WE BROKE IT
		*/
		var x = 1;

		/*
        for (const [key, value] of Object.entries(elementDict)) {
            this.elements[key] = document.querySelector (value);
        }            

        for (const [key, value] of Object.entries(templateDict)) {
            this.templates[key] = this.te.compileTemplate (value);
        }            

        for (const [key, value] of Object.entries(modelDict)) {
            this.models[key] = value;
        }            

        for (const [key, value] of Object.entries(viewDict)) {
            this.views[key] = value;
        }            

        for (const [key, value] of Object.entries(controllerDict)) {
            this.controllers[key] = value;
        }            
		*/

	}

	


	elementAdd(selector) {
		this[snakeToCamel (selector)] = document.querySelector (selector);;
		return this;
	}

	elementRemove(name) {
		delete this[name];
		return this;
	}

	elementsAdd(selectorArr) {
		var me = this;
		selectorArr.forEach (function (selector) {
			me.elementAdd (selector);
		});

		return this;
	}

	/*
	elementsRemove(name) {
		delete this.el;
		return this;
	}
	*/
	
	templateAdd(name, template) {
		this.templates[name] = this.te.compileTemplate(template);
		return this;
	}

	templateRemove(name) {
		delete this.templates[name];
		return this;
	}

	templatesAdd(templateDict) {
		for (const [key, value] of Object.entries(templateDict)) {
			//this.templates[name] = this.te.compileTemplate (value);		
			this.templateAdd(key, value);
		}
		return this;
	}

	templatesRemove(name) {
		delete this.templates[name];
		return this;
	}

	eventListenerAdd(el, ev,  handler) {
		var me = this.me; //Tricky! Very Tricky!!
		el.addEventListener(ev, (evt) => handler.call(me, evt));
		return this;
	}

	eventListenerRemove(el, ev) {
		this.el[el].removeEventListener(ev);
		return this;
		
	}

	eventListenersAdd(arr) {
		var me = this;
		/*
		for (const [el, handlerDict] of Object.entries(eventDict)) {
			//this.templates[name] = this.te.compileTemplate (value);		
			for (const [ev, handler] of Object.entries(handlerDict))
				this.eventListenerAdd(el, ev, handler);
		}
		*/
		arr.forEach(function(e) {
			me.eventListenerAdd (e[0], e[1], e[2]);
		});
		return this;
	}

	// //

	modelAdd(name, model) {
		this.models[name] = new model();
		return this;
	}

	modelRemove(name) {
		delete this.models[name];
		return this;
	}

	viewAdd(name, view) {
		this.views[name] = new view();
		return this;
	}

	viewRemove(name) {
		delete this.view[name];
		return this;
	}

	controllerAdd(name, controller) {
		this.controllers[name] = new controller();
		return this;
	}

	controllerRemove(name) {
		delete this.controllers[name];
		return this;
	}

	//@abstract
	uponReady () {
		// {To support backward compatibility
		let self = this;
		for (const [key, _] of Object.entries(this.wc)) {
			this.wc[key].uponReady ();
		}		
		// }To support backward compatibility

		/*
		$("*").each(function() { 
            if (this.id) { 
                self.el[this.id] = this; 
            } 
        }); 
		*/
		let elArr = document.querySelectorAll('[id]');
		for (let i = 0; i < elArr.length; ++i) {
			elArr[i].uponReady && elArr[i].uponReady ();
			this.el[elArr[i].id] = elArr[i];
		}		

		return this;

	}

}


class FormComponent extends WebComponent {
	constructor(selector) {
		super(selector);
	}

	browseFirst (event) {
		if (this.dataIndex == 1) {
			return false;
		}
		this.dataIndex = 1;
		
		//this.scatter ();				
		return true;
	}

	browsePrev (event) {
		if (this.dataIndex == 1) {
			return false;
		}		
		this.dataIndex--;
		if (this.dataIndex < 1) {
			this.dataIndex = 1;
		}

		//this.scatter ();				
		return true;

	}

	browseNext (event) {
		if (this.dataIndex == this.dataMax) {
			return false;
		}			
		
		this.dataIndex++;
		if (this.dataIndex > this.dataMax) {
			this.dataIndex = this.dataMax;
		}
	
		//this.scatter ();				
		return true;
	}

	browseLast (event) {
		if (this.dataIndex == this.dataMax) {
			return false;
		}
		this.dataIndex = this.dataMax;
		
		//this.scatter ();				
		return true;
	}


}

class EditorComponent extends FormComponent {
	constructor(selector) {
		super(selector);
	}
}

class WebComposite extends Composite {
	constructor() {
		super();
	}
}

class WebPage extends WebComponent {
	constructor() {
		super();
	}

	webComponentAdd(webComponent) {
		this.wc[webComponent._id] = webComponent;
		return this;
	}

	uponReady() {
		super.uponReady ();

	}

	addEventHandler (el, ev,  handler) {
		var me = this.me; //Tricky! Very Tricky!!
		el.addEventListener(ev, (evt) => handler.call(me, evt));
		return this;
	}

}

/*
class WebController extends Controller () {
	constructor() {
		super();
		this.wc = {};
	}

}
*/
class WebApplication extends Class {
	constructor() {
		super();
		this.page = {};
		this.services = {};
	}

	dealy(ms) {
		return new Promise(resolve => {
			setTimeout(() => {
			resolve('resolved');
			}, ms);
		});
	}
	
	locateService(svc) {
		var s = this.services[svc.name].instance;
		return s;
	}

	setPageInstance(webPage) {
		this.page = webPage;
		return this;
	}

	serviceClassAdd(serviceClass, ...args) {
		let svc = serviceClass.name;
		this.services[svc] = {};
		this.services[svc].instance = new serviceClass(...args);
		return this;
	}

	serviceInstanceAdd(serviceClassName, serviceInstance) {
		this.services[serviceClassName] = {};
		this.services[serviceClassName].instance = serviceInstance;
		return this;
	}

	// FIX_IT: it doesn't work
	xservicesAdd(serviceDict) {
		for (const [key, value] of Object.entries(serviceDict)) {
			this.serviceClassAdd(key, value);
		}
		return this;
	}

	uponReady() {
		try {
			this.page.uponReady();
		}
		catch(err) {
			alert (err.message);
		}		
		
		return this;
	}

}




//
// /WEB COMPONENT OBJECT MODEL
// ////////////////////////////////////////////////////////


// /////////////////////////////////////////////////////////////////////////////////////////////////////////////// //

class FormValidator extends Service {
	constructor(config) {
		super();
		this.fieldValidator = new FieldValidator();
		this.config = config;
	}

	validate(formSelector, formError) {
		var ret = true;
		let me = this.me;
		$(formSelector).find("[data-validation]").each(function () {
			var $field = $(this);
			var fieldErrorRef = { fieldError: [] };
			me.fieldValidator.validate($field, fieldErrorRef);
			if (fieldErrorRef.fieldError.length > 0) {
				formError[$field.attr('id')] = fieldErrorRef.fieldError.concat(); //????
				ret = false;
			}
			
		});
		//$ ('[data-toggle="tooltip"]').tooltip();
		return ret;
	}

	zvalidateIfValuedz(formSelector) {
		//var fv = new FieldValidator();
		var ret = true;
		$(formSelector).find("[data-validation]").each(function () {
			var $field = $(this);
			if ($field.attr('data-validation') !== undefined) {
				if ($field.val() == null || $field.val() == undefined || $field.val() == "") {
					return true;
				}
				else {
					if ($field.val().toString().length > 0) {
						if (!this.fieldValidator.validate($field)) {
							ret = false;
						}
					}
				}
			}
		});
		$('[data-toggle="tooltip"]').tooltip();
		return ret;
	}

	zvalidateFieldz(arr) {
		if (arr === null || typeof (arr) !== 'object' || arr.length <= 0) return false;
		var err = 0, selector;
		for (var a = 0, b = arr.length; a < b; a++) {
			selector = arr[a];
			if (selector === null || selector === undefined || !selector) { err++; continue; }
			selector = String(selector);
			if (selector.indexOf('#') < 0) {
				selector = '#' + selector;
			}
			var ins = $(selector);
			var val = ins.val();
			if (val === '' || val === undefined || val === null) { ins = undefined; continue; }
			this.zvalidateFieldSingleValuez(ins) ? 0 : err++; ins = undefined;
		}
		arr = undefined;
		return err <= 0;
	}

	zvalidateFieldSingleValuez(fieldSelector) {
		var ret = true;
		var $field = $(fieldSelector);
		if (!this.fieldValidator.validate($field)) {
			ret = false;
		}
		return ret;
	}

}

class FieldValidator extends Class {
	/**
	 * 
	 * RULES
	 *  
	 */

	constructor() {
		super();
	}

	validate($field, fieldErrorRef) {
        /*
        The characters ^$.?*!+-:=()[]{}|\\ must be escaped - except when then occur inside a character class.
        */
		var _msg = "";
		var fieldError = [];
		var _$fld = $field;
		var rules = $field.attr("data-validation") || "";
		//if (rules === undefined){
		// rules = "";
		//}
		var _fldTitle = ""; //deprecated. we must remov it altogether.
		var queryStringDictionary = {};
		var queryString = rules;

		if ($field[0].type === "file") {
			return true;
		}		
		
		if (queryString.length <= 0) {
			//_$fld.style.background = "White"; //reinforced
			return true;
		}
		var pairs = queryString.split(";");
		// Load the key/values of the return collection
		var keyValuePair, v;

		for (var i = 0; i < pairs.length; i++) {
			keyValuePair = null;
			v = null;
			keyValuePair = pairs[i].split("=");
			if (keyValuePair[0] !== undefined) {
				v = ((keyValuePair[1] === undefined) || (keyValuePair[1] === null)) ? "1" : keyValuePair[1];
			}
			queryStringDictionary[keyValuePair[0].toLowerCase().trim()] = !v ? '' : v.toLowerCase().trim();
		}

		for (var key in queryStringDictionary) {
			if ((queryStringDictionary[key] == "true") || (queryStringDictionary[key] > 0) || (queryStringDictionary[key] == "")) {
				_$fld.val(this.encodeHtmlClosures(_$fld.val()));
			}
			if (key == "required") {
				if ((queryStringDictionary[key] == "true") || (queryStringDictionary[key] > 0) || (queryStringDictionary[key] == "")) {
					this.validateRequired(queryStringDictionary[key], _$fld, fieldError);
				}
			}
			else if (key == "striphtml") {
				if ((queryStringDictionary[key] == "true") || (queryStringDictionary[key] > 0) || (queryStringDictionary[key] == "")) {
					_$fld.val(this.stripHtml(_$fld.val()));
				}
			}
			else if (key == "sanitizehtml") {
				throw "Not Implemented.";
			}
		}

		//if (_$fld.val() && _$fld.val().length > 0) {
		for (key in queryStringDictionary) {
			switch (key) {
				case "exactvalue": this.validateExactValue(queryStringDictionary[key], _$fld, fieldError); break;
				case "minvalue": this.validateMinValue(queryStringDictionary[key], _$fld, fieldError); break;
				case "maxvalue": this.validateMaxValue(queryStringDictionary[key], _$fld, fieldError); break;
				case "notvalue": this.validateNotValue(queryStringDictionary[key], _$fld, fieldError); break;
				case "exactlength": this.validateExactLength(queryStringDictionary[key], _$fld, fieldError); break;
				case "minlength": this.validateMinLength(queryStringDictionary[key], _$fld, fieldError); break;
				case "maxlength": this.validateMaxLength(queryStringDictionary[key], _$fld, fieldError); break;
				case "notlength": this.validateNotLength(queryStringDictionary[key], _$fld, fieldError); break;
				case "datatype": this.validateDataType(queryStringDictionary[key], _$fld, fieldError); break;
			}
		}
		//}
		fieldErrorRef.fieldError = fieldError.concat(); //????
		return fieldError.length == 0 ? true : false;
	}
	/**** helper functions *********************************************************************/
	validateExactValue(val, _$fld, fieldError) {
		if (_$fld.val() != val) {
			fieldError.push(" should exactly be equal to the value of " + val.toString() + ".\r\n");
			return false;
		}
		else {
			return true;
		}
	}

	validateMinValue(val, _$fld, fieldError) {
		if (Number(_$fld.val()) < Number(val)) {
			fieldError.push(" should not be less than the minimum value of " + val.toString() + ".\r\n");
			return false;
		}
		else {
			return true;
		}
	}

	validateMaxValue(val, _$fld, fieldError) {
		if (Number(_$fld.val()) > Number(val)) {
			fieldError.push(" should not be greater than the maximum value of " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateNotValue(val, _$fld, fieldError) {
		if (Number(_$fld.val()) == Number(val)) {
			fieldError.push(" should not contain the value " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateRequired(val, _$fld, fieldError) {
		if (!_$fld.val()) {
			fieldError.push(" is a required field.\r\n");
			return false;
		}
		if (_$fld.val().length < 1) {
			fieldError.push(" is a required field.\r\n");
			return false;
		}
		return true;
	}

	validateExactLength(val, _$fld, fieldError) {
		if (_$fld.val().length != val) {
			fieldError.push(" requires an exact data length of " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateMinLength(val, _$fld, fieldError) {
		if (_$fld.val().length < val) {
			fieldError.push(" should not be less than the minimum data length of " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateMaxLength(val, _$fld, fieldError) {
		if (_$fld.val().length > val) {
			fieldError.push(" should not be greater than the maximum data length of " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateNotLength(val, _$fld, fieldError) {
		if (_$fld.val().length == val.length) {
			fieldError.push(" data length can not be as long as " + val.toString() + ".\r\n");
			return false;
		}
		return true;
	}

	validateDataType(val, _$fld, fieldError) {
		var msg = "";
		var ret = true;
		switch (val.toLowerCase().trim()) {
			case "email": ret = this.validateDataTypeEmail(_$fld, fieldError); break;
			case "userid": ret = this.validateDataTypeUserID(_$fld, fieldError); break;
			case "password": ret = this.validateDataTypePassword(_$fld, fieldError); break;
			case "date":
			case "datetime": ret = this.validateDataTypeDate(_$fld, fieldError); break;
			case "phone": ret = this.validateDataTypePhone(_$fld, fieldError); break;
			case "url": ret = this.validateDataTypeUrl(_$fld, fieldError); break;
			case "domain": ret = this.validateDataTypeDomain(_$fld, fieldError); break;
			case "numeric": ret = this.validateDataTypeNumeric(_$fld, fieldError); break; //if (!this.validateDataTypeNumeric (_$fld, fieldError)) { fieldError.push (" should only contain numeric values.\r\n"); } break;
			case "alphabetic": ret = this.validateDataTypeAlpha(_$fld, fieldError); break; //if (!this.validateDataTypeAlpha (_$fld, fieldError)) { fieldError.push (" should only contain alphabetic values.\r\n"); } break;
			case "alphanumeric": ret = this.validateDataTypeAlphaNumeric(_$fld, fieldError); break; //if (!this.validateDataTypeAlphaNumeric (_$fld, fieldError)) { fieldError.push (" should contain alphanumeric values.\r\n"); } break;
			//case "mixedcharacter": ret = this.validateDataTypeMixedCharacter (_$fld, fieldError); break; //if (!this.validateDataTypeMixedCharacter (_$fld, fieldError)) { fieldError.push (" should contain alphanumeric values.\r\n"); } break;
		}
		//mixedacteracter
		//if (msg.length > 0) { fieldError.push (msg); return; }
		return ret;
	}

	validateEmpty($fld, fieldError) {
		//var error = "";
		if ($fld.val().length == 0) {
			fieldError.push(" should not be left blank.\r\n");
			return false;
		}
		return true;
	}

	validateCheckBox($fld, fieldError) {
		//var error = "";
		if ($fld.is(':checked') == false) {
			fieldError.push(" can not be left unchecked.\r\n");
			return false;
		}
		return true;
	}

	validateDataTypeUserID($fld, fieldError) {
		//var error = "";
		var illegalChars = /[^A-Za-z0-9_.@]/;
		var v = $fld.val();

		if (!this.isPlainAscii(v)) {
			fieldError.push(" can not contain extended characters.\r\n");
			return false;

		}
		else if (v == "") {
			fieldError.push(" can not be left blank.\r\n");
			return false;
		}
		else if (illegalChars.test(v)) {
			fieldError.push(" should only contain letters, numbers, periods(.), @ and underscores.\r\n");
			return false;
		}
		return true;
	}

	validateDataTypePassword($fld, fieldError) {
		//var error = "";
		var illegalChars = /\W/; // allow letters, numbers, and underscores
		var v = $fld.val();
		if (!this.isPlainAscii(v)) {
			fieldError.push(" can not contain extended characters.\r\n");
			return false;
		}
		else if (v.length <= 5) {
			fieldError.push(" must be greater than 5 characters long.\r\n");
			return false;
		}
		else if (illegalChars.test(v)) {
			fieldError.push(" should only contain letters, numbers, and underscores.\r\n");
			return false;
		}
		return true;
	}

	validateDataTypeEmail($fld, fieldError) {
		//var error = "";
		var tfld = this.myTrim(" " + $fld.val()); // value of field with whitespace trimmed off
		var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
		var illegalChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;

		if ($fld.val() == "") {
			fieldError.push(" can not be left blank.\r\n");
			return false;
		}
		else if (!emailFilter.test(tfld)) { //test email for illegal characters
			fieldError.push(" should not be invalid email address.\r\n");
			return false;
		}
		else if ($fld.val().match(illegalChars)) {
			fieldError.push(" should not contain disallowed characters.\r\n");
			return false;
		}
		return true;
	}

	myTrim(str) {
		if (str.length === 0)
			return str;
		return str.replace(/^\s+|\s+$/, '');
	}

	validateDataTypeEmailV2($fld, fieldError) {
		var emailExp = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
		if ($fld.val().match(emailExp)) {
			return true;
		}
		else {
			fieldError.push(" can not be invalid formatted.\r\n");
			return false;
		}
	}

	validateDataTypePhone($fld, fieldError) {
		var error = "";
		var chars = /[^0-9\-()+ ]/;

		if ($fld.val() == "") {
			fieldError.push(" can not be left blank.\r\n");
			return false;
		}
		else if (chars.test($fld.val())) {
			fieldError.push(" should only contain valid number in correct format.\r\n");
			return false;
		}
		return true;
	}

	validateDataTypeUrl($fld, fieldError) {
		var theurl = $fld.val();
		var tomatch = /^(ftp|http|https):\/\/[A-Za-z0-9\.-]{3,}\.[A-Za-z]{2,}/;

		if (tomatch.test(theurl)) {
			return true;
		}
		else {
			fieldError.push(" can not be invalid formatted.\r\n");
			return false;
		}
	}

	getDomain(uri) {
		if (!uri) return null;
		let match = uri.match(/^(?:https?:)?(?:\/\/)?([^\/\?]+)/);
		if (match === null) {
			return null;
		}
		uri = match[1];
		if (!uri) return null;
		if (uri.indexOf('//') > -1) {
			let spl = uri.split("//");
			if (spl.length >= 2) {
				uri = spl[1];
				let hl = spl[0];
				let h = hl.split(":");
				if (h === null) return false;
				let q = h[0];
				if (!q) return false;
				q = String(q).toLowerCase();
				if (q.in('https', 'http') !== true) return null;
			}
			else {
				return null;
			}
		}

		return uri;
	}

	validateDataTypeDomain($fld, fieldError) {
		var theurl = $fld.val();
		theurl = this.getDomain(theurl);
		if (theurl === null) {
			fieldError.push(" can not be invalid formatted.\r\n");
			return false;
		}
		//var tomatch = /[A-Za-z0-9\.-]{3,}/;
		if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(theurl)) {
			return true;
		}
		else {
			fieldError.push(" can not be invalid formatted.\r\n");
			return false;
		}
	}

	validateDataTypeDate($fld, fieldError) {
		var dteDate;
		var day, month, year;
		var strDate = $fld.val();
		var datePat = /^(\d{4})(\-)(\d{1,2})(\-)(\d{1,2})$/;
		var matchArray = strDate.match(datePat);
		if (matchArray == null) {
			fieldError.push(" should contain a YYYY-MM-DD formatted date.\r\n");
			return false;
		}
		year = matchArray[1];
		month = matchArray[3];
		month--;
		day = matchArray[5];
		dteDate = new Date(year, month, day);
		if ((day == dteDate.getDate()) && (month == dteDate.getMonth()) && (year == dteDate.getFullYear())) {
			return true;
		}
		fieldError.push(" should contain a valid date.\r\n");
		return false;
	}

	isPlainAscii(str) {
		var n = 0;
		var c = 0;
		for (n = 0; n < str.length; n++) {
			c = str.charCodeAt(n);
			if ((c < 32) || (c > 127))
				return false;
		}
		return true;
	}

	// If the length of the element's string is 0 then display helper message
	isEmpty($fld) {
		if ($fld.val().length == 0) {
			return true;
		}
		return false;
	}

	// If the element's string matches the regular expression it is all numbers
	validateDataTypeNumeric($fld, fieldError) {
		var numericExpression = /^[0-9 .]+$/;
		if ($fld.val().match(numericExpression)) {
			return true;
		}
		else {
			fieldError.push(" must be Numeric");
			return false;
		}
	}

	// If the element's string matches the regular expression it is all letters
	validateDataTypeAlpha($fld, fieldError) {
		var alphaExp = /^[a-zA-Z]+$/;
		if ($fld.val().match(alphaExp)) {
			return true;
		}
		else {
			fieldError.push(" must be Alphabetic.");
			return false;
		}
	}

	// If the element's string matches the regular expression it is numbers and letters
	validateDataTypeAlphaNumeric($fld, fieldError) {
		var alphaExp = /^[0-9a-zA-Z]+$/;
		if ($fld.val().match(alphaExp)) {
			return true;
		}
		else {
			fieldError.push(" must be Alphanumeric.");
			return false;
		}
	}

	//mixedcharacter
	xvalidateDataTypeMixedCharacterx($fld, fieldError) {
		///^[a-zA-Z0-9 ._-]+$/
		return true;
        /*var mixedExp = /^[0-9a-zA-Z,. (,)\/*_-]+$/;
        if ($fld.val().match(mixedExp)) {
            return true;
        }
        else {
            return false;
        }*/
	}

	zisLengthViolatedz($fld, min, max) {
		var uInput = $fld.val();
		if (uInput.length >= min && uInput.length <= max) {
			return true;
		}
		else {
			return false;
		}
	}

	encodeHtmlClosures(fldVal) {
		//TODO: needs to fix bug: if called repeatitively, fldValue grows, grows, grows....
		if (!fldVal) return "";/////////--------------------------------
		var error = "";
		var illegalChars = /[<>"']/g;
		var newVal = fldVal.replace(
			illegalChars, function (match) {
				var dict = {
					'<': '[',
					'>': ']',
					/*not so offensive: '&': '&amp;',*/
					'"': '#',
					"'": '`'
				};
				return dict[match];
			}
		);
		return newVal;
	}

	decodeHtmlClosures(fldVal) {
		var error = "";
		//var illegalChars = /&amp;|&lt;|&gt;|&quot;|&#039;/g;
		var illegalChars = /&lt;|&gt;|&quot;|&#039;/g;
		var newVal = fldVal.replace(
			illegalChars, function (match) {
				var dict = {
					/*'&amp;': '&',*/
					'[': '<',
					']': '>',
					'#': '"',
					'`': '\''
				};
				return dict[match];
			}
		);
		return newVal;
	}

	stripHtml(someHTML) {
		var s;
		s = someHTML.replace(/<[^>]+>/g, "");
		return s;
	}

	sanitizeHtml(someHTML) {
		throw "Not Implemented.";
	}


	xsetResultx(errors, elid) {
		//$field.parent().find("div#fldErr_" + elid).first().remove();
		if (errors.length > 0) {
			var htm = "";
			$("#div_" + elid).attr('title', '').removeClass("has-success")//Newly Added
				//$("â€ª#â€Žfeed_â€¬" + elid).removeClass("glyphicon glyphicon-ok");//Newly Added
				.addClass("has-error");//Newly Added
			$("#" + elid).attr('title', '').removeClass("has-success")//Newly Added
				//$("â€ª#â€Žfeed_â€¬" + elid).removeClass("glyphicon glyphicon-ok");//Newly Added
				.addClass("has-error");
			//$("#feed_" + elid).addClass("glyphicon glyphicon-remove");//Newly Added
			for (var error in errors) {
				if (errors[error].length > 0)
					//htm += "<li>" + errors[error] + "</li>";
					htm += errors[error];
			}
			//htm += "</ul></div>";
			$("#" + elid).attr('title', htm);
			return;
		}
		$("#div_" + elid).removeClass("has-error").addClass("has-success")//Newly Added
			//$("#feed_" + elid).removeClass("glyphicon glyphicon-remove");//Newly Added
			//$("#div_" + elid).addClass("has-success");//Newly Added
			//$("#feed_" + elid).addClass("glyphicon glyphicon-ok");//Newly Added
			.attr('title', "");
		$("#" + elid).attr('title', '').removeClass("has-success")//Newly Added
			//$("â€ª#â€Žfeed_â€¬" + elid).removeClass("glyphicon glyphicon-ok");//Newly Added
			.addClass("has-error");
		return;
	}
}

