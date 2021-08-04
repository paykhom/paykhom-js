'use strict';

//import * as dp from './dp.js'

// ////////////////////////////////////////////////////////////////////////////////////////// //
// Template Engine

// doT.js
// 2011-2014, Laura Doktorova, https://github.com/olado/doT
// Licensed under the MIT license.

(function () {
	"use strict";

	var doT = {
		name: "doT",
		version: "1.1.1",
		templateSettings: {
			evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
			interpolate: /\{\{=([\s\S]+?)\}\}/g,
			encode:      /\{\{!([\s\S]+?)\}\}/g,
			use:         /\{\{#([\s\S]+?)\}\}/g,
			useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
			define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
			defineParams:/^\s*([\w$]+):([\s\S]+)/,
			conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
			iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
			varname:	"it",
			strip:		true,
			append:		true,
			selfcontained: false,
			doNotSkipEncoded: false
		},
		template: undefined, //fn, compile template
		compile:  undefined, //fn, for tokeness
		log: true
	}, _globals;

	doT.encodeHTMLSource = function(doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	};

	_globals = (function(){ return this || (0,eval)("this"); }());

	/* istanbul ignore else */
	if (typeof module !== "undefined" && module.exports) {
		module.exports = doT;
    } 
    else if (typeof define === "function" && define.amd) {
		define(function(){return doT;});
    } 
    else {
		_globals.doT = doT;
	}

	var startend = {
		append: { start: "'+(",      end: ")+'",      startencode: "'+encodeHTML(" },
		split:  { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" }
	}, skip = /$^/;

	function resolveDefs(c, block, def) {
		return ((typeof block === "string") ? block : block.toString())
		.replace(c.define || skip, function(m, code, assign, value) {
			if (code.indexOf("def.") === 0) {
				code = code.substring(4);
			}
			if (!(code in def)) {
				if (assign === ":") {
					if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
						def[code] = {arg: param, text: v};
					});
					if (!(code in def)) def[code]= value;
                } 
                else {
					new Function("def", "def['"+code+"']=" + value)(def);
				}
			}
			return "";
		})
		.replace(c.use || skip, function(m, code) {
			if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
				if (def[d] && def[d].arg && param) {
					var rw = (d+":"+param).replace(/'|\\/g, "_");
					def.__exp = def.__exp || {};
					def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
					return s + "def.__exp['"+rw+"']";
				}
			});
			var v = new Function("def", "return " + code)(def);
			return v ? resolveDefs(c, v, def) : v;
		});
	}

	function unescape(code) {
		return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");
	}

	doT.template = function(tmpl, c, def) {
		c = c || doT.templateSettings;
		var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
			str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

		str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ")
					.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""): str)
			.replace(/'|\\/g, "\\$&")
			.replace(c.interpolate || skip, function(m, code) {
				return cse.start + unescape(code) + cse.end;
			})
			.replace(c.encode || skip, function(m, code) {
				needhtmlencode = true;
				return cse.startencode + unescape(code) + cse.end;
			})
			.replace(c.conditional || skip, function(m, elsecase, code) {
				return elsecase ?
					(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
					(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
			})
			.replace(c.iterate || skip, function(m, iterate, vname, iname) {
				if (!iterate) return "';} } out+='";
				sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
				return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
					+vname+"=arr"+sid+"["+indv+"+=1];out+='";
			})
			.replace(c.evaluate || skip, function(m, code) {
				return "';" + unescape(code) + "out+='";
			})
			+ "';return out;")
			.replace(/\n/g, "\\n").replace(/\t/g, '\\t').replace(/\r/g, "\\r")
			.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, "");
			//.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

		if (needhtmlencode) {
			if (!c.selfcontained && _globals && !_globals._encodeHTML) _globals._encodeHTML = doT.encodeHTMLSource(c.doNotSkipEncoded);
			str = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("
				+ doT.encodeHTMLSource.toString() + "(" + (c.doNotSkipEncoded || '') + "));"
				+ str;
		}
		try {
			return new Function(c.varname, str);
		} catch (e) {
			/* istanbul ignore else */
			if (typeof console !== "undefined") console.log("Could not create a template function: " + str);
			throw e;
		}
	};

	doT.compile = function(tmpl, def) {
		return doT.template(tmpl, null, def);
	};
}());

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Implementation of Paykhom JS Framework
// File: framework/paykhom/core.js
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class TemplateEngine extends Service {
	constructor () {
		super ();
	}

    transpileTemplate (t) {
        const TOKEN_TYPE__NONE = 0;
        const TOKEN_TYPE__HTML = 1;
        const TOKEN_TYPE__EXPRESSION = 2;
        const TOKEN_TYPE__SCRIPT__STMT = 3;
        const TOKEN_TYPE__SCRIPT__ENDSTMT = 4;
        
        const TOKEN_PHASE__NONE = 0;
        const TOKEN_PHASE__BEGIN = 1;
        const TOKEN_PHASE__RUNNING = 2;
        const TOKEN_PHASE__END = 3;
        
        const EXPRESSION_BEGIN_FLAG = 1
        const EXPRESSION_END_FLAG = 2

        var dotExpr = "";
        var tokenPhase = TOKEN_PHASE__NONE, tokenDepth = 0; 
        var tokenType = TOKEN_TYPE__NONE, token="", tokenArr = [], chp, ch, chn, pos = -1, len = t.length;
        //var htmlExprPhase = 0, htmlBegin, htmlRunning, htmlEnd, htmlExprDepth = 0; 
        //var codeExprPhase = 0, codeBegin, codeRunning, codeEnd, codeExprDepth = 0;
        var exprFlags = 0;
		
		//var t = '  <tbody>for(i = 0; i < 10; i++) { <tr><td>{i}<td></tr> } </tbody>';
        //t = "<?>" + t + "</?>.";
        var brace = {
            b1 : {
                begin : {symbol: "(", count : 0},
                end : {symbol: ")", count : 0},
                count : 0,
            },
            b2 : {
                begin : {symbol: "{", count : 0},
                end : {symbol: "}", count : 0},
                count : 0,
            },
            /*
            b3 : {
                begin : {symbol: "[", count : 0},
                end : {symbol: "]", count : 0},
                count : 0,
            },
            */
        b4 : {
                begin : {symbol: "<", count : 0},
                end : {symbol: ">", count : 0},
                count : 0,
            },
        }

        var oldTokenType = tokenType;

        for (;;) {
            if (tokenType != oldTokenType) {
                oldTokenType = tokenType;            
                brace.b1.count = 0; brace.b1.begin.count = 0; brace.b1.end.count = 0;
                brace.b2.count = 0; brace.b2.begin.count = 0; brace.b2.end.count = 0;
                //brace.b3.count = 0; brace.b3.begin.count = 0; brace.b3.end.count = 0;
                brace.b4.count = 0; brace.b4.begin.count = 0; brace.b4.end.count = 0;
            }

            pos++; 
            if (pos == len) {
                break;
            }
            chp = (pos > 0) ? t[pos-1] : '';
            ch = t[pos];
            chn = ((pos) < len - 1) ? t[pos+1] : '';
            token += ch;

            //console.log('"' + token + '"');
            if (token === "for (i = 0; i < 10; i++) {\n        ") {
                token = token;
            }
            if (chp != '\\') {
                switch (ch) {
                    case '(': brace.b1.count++; brace.b1.begin.count++; break;
                    case ')': brace.b1.count--; brace.b1.end.count++; break;
                    case '{': brace.b2.count++; brace.b2.begin.count++; break;
                    case '}': brace.b2.count--; brace.b2.end.count++; break;
                    //case '[': brace.b3.count++; brace.b3.begin.count++; break;
                    //case ']': brace.b3.count--; brace.b3.end.count++; break;
                    case '<': brace.b4.count++; brace.b4.begin.count++; break;
                    case '>': brace.b4.count--; brace.b4.end.count++; break;
                }
            }

            switch (tokenType) {
                case TOKEN_TYPE__NONE:
                    if (ch == '<') {
                        tokenType = TOKEN_TYPE__HTML;               
                        //tokenPhase = TOKEN_PHASE__BEGIN;     
        
                    }
                    else {
                        tokenType = TOKEN_TYPE__EXPRESSION;               
                        //tokenPhase = TOKEN_PHASE__BEGIN;     

                    }
                    break;

                case TOKEN_TYPE__HTML:
                    if (brace.b4.count == 0) {
                        if (/[ \t\n\r<]/.test (chn)) {
                            //tokenPhase = TOKEN_PHASE__RUNNING;     
                        }
                        else {
                            //tokenPhase = TOKEN_PHASE__END;     
                            dotExpr += token;
                            tokenArr.push (token);
                            token = "";
                            tokenType = TOKEN_TYPE__EXPRESSION;
                            //tokenPhase = TOKEN_PHASE__BEGIN;     //????????????????????????
                        }
                    }
                    break;

                case TOKEN_TYPE__EXPRESSION:
                    if (ch == '<')
                        ch = ch;
                    if ((chn == '<') && (chp != '\\') && (brace.b1.count == 0)) {
                        
                        if (brace.b2.count  == 0) { //expression / interpolation: `Hello {name}`
                            tokenPhase = TOKEN_PHASE__END;
                            dotExpr += token; // requires post-processing using regExp to transpile `{data}` to `{{=data}}`:
                            token = "";
                            tokenType = TOKEN_TYPE__HTML;
                        }
                        else if ((brace.b2.count > 0) && (brace.b1.count == 0)) { // statements like `for... / if.... {`
                            tokenPhase = TOKEN_PHASE__END;
                            dotExpr += ("{{" + token + "}}");
                            token = "";
                            tokenType = TOKEN_TYPE__HTML;
                        }
                        else if (brace.b2.count < 0) { // end statement `}`
                            tokenPhase = TOKEN_PHASE__END;
                            dotExpr += ("{{" + token + "}}");
                            token = "";
                            tokenType = TOKEN_TYPE__HTML;
                        }

                        //tokenPhase = TOKEN_PHASE__BEGIN;     //????????????????????????
                    }
                    break;
                }
        }
        //Post-Processing
        return dotExpr.replace(/[^{][{](\w*)[}]/gi, ' {{=$1}}');
    }

    compileTemplate (template) {
        // 1. Compile template function
        //var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");
        // 2. Use template function as many times as you like
        //var resultText = tempFn({foo: 'with doT'});

        // returns the rendererFn that can be run many many times without compiling each time.
        var rendererFn = doT.template (this.transpileTemplate (template));
        return rendererFn;
    }

    renderTemplate (renderer, modelData) {
        // 1. Compile template function
        //var tempFn = doT.template("<h1>Here is a sample template {{=it.foo}}</h1>");
        // 2. Use template function as many times as you like
        //var resultText = tempFn({foo: 'with doT'});

        return renderer (modelData);

    }

    runTemplate (template, modelData) {
        return this.renderTemplate (this.compileTemplate (template), modelData);
    }

    runTemplate (template, modelData) {
        return this.renderTemplate (this.compileTemplate (template), modelData);
    }

    applyTemplate (template, modelData, el) {
        var i = "", o = "";
        if ((typeof template === "object") && (template['innerHTML'])) {
            i = template.innerHTML;
        }
        else {
            i = template;
        }

        o = this.runTemplate (template, modelData);
        if (typeof el !== "undefined") {
            el.innerHTML = o;
        }
        else {
            return o;
        }
    }

}

// /////////////////////////////////////////////////////////////////////////////////////////////////
// YGTE

class Ygte extends Class {
	constructor () {
		super ();
	}

	render (template, model = null) {
		let accumulator = '';
		for (let c of template.render(model)) {
			accumulator += c;
		}
		return accumulator;
	}

}
// /YGTE
// /////////////////////////////////////////////////////////////////////////////////////////////////
