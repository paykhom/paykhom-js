'use strict';


class HttpHeader extends Headers {
	constructor() {
		super();
	}
}
class HttpRequest extends Request {
	constructor(url, init = null, header = null) {
		if (header !== null)
			init.headers = header;
		super(url, init);
	}

}
class HttpResponse extends Response {
	constructor() {
		super();
	}

}


class HttpClient extends Service {
	constructor(config) {
		super();
		//this.webClient = client
		this.config = config;
		this.middlewares = {};
		this.requestHandlerManager = new LinkedList();
		this.responseHandlerManager = new LinkedList();
	}

	middlewareAdd(middlewareClass, config) {
		this.middlewares[middlewareClass.name] = {};
		this.middlewares[middlewareClass.name].instance = new middlewareClass(config);
		return this;
	}

	middlwareInstanceAdd(middlewareClassName, middlewareInstance) {
		this.services[middlewareClassName] = {};
		this.services[middlewareClassName].instance = middlewareInstance;
		return this;
	}

	locateMiddleware(middlewareClass) {
		return this.middlewares[middlewareClass.name].instance;
	}

	requestHandlerAdd(reqMiddlewareFn) {
		this.requestHandlerManager.add(reqMiddlewareFn);
		return this;
	}

	responseHandlerAdd(respMiddlewareFn) {
		this.responseHandlerManager.add(respMiddlewareFn);
		return this;
	}

	async invokeFirstRequestMiddleware(req) {
		req.nextRequestMiddlewareNode = this.requestHandlerManager.head.next;
		await this.requestHandlerManager.head.element(req, this.invokeNextRequestMiddleware);
	}

	async invokeNextRequestMiddleware(req) {
		let currentRequestMiddlewareNode = req.nextRequestMiddlewareNode;
		if (currentRequestMiddlewareNode) {
			req.nextRequestMiddlewareNode = currentRequestMiddlewareNode.next;
			await currentRequestMiddlewareNode.element(req, this.invokeNextRequestMiddleware);
		}
		else {
			req.nextRequestMiddlewareNode = null; // TODO: actually, we must remove it. 
		}
	}

	async invokeFirstResponseMiddleware(resp) {
		resp.nextResponseMiddlewareNode = this.responseHandlerManager.head.next;
		await this.responseHandlerManager.head.element(resp, this.invokeNextResponseMiddleware);
	}

	async invokeNextResponseMiddleware(resp) {
		let currentResponseMiddlewareNode = resp.nextResponseMiddlewareNode;
		if (currentResponseMiddlewareNode) {
			req.nextResponseMiddlewareNode = currentResponseMiddlewareNode.next;
			await currentResponseMiddlewareNode.element(resp, this.invokeNextResponseMiddleware);
		}
		else {
			resp.nextResponseMiddlewareNode = null; // TODO: actually, we must remove it. 
		}

	}

	async fetch(method, url, init = null, acl = null) {
		//acl = acl || {isErrorMessageEnabled: false, isSuccessMessageEnabled: false, bodyExtractMethod: "json"};
		acl = acl || {};
		acl.isErrorMessageEnabled = acl.isErrorMessageEnabled || false; 
		acl.isSuccessMessageEnabled = acl.isSuccessMessageEnabled || false; 
		acl.isRedirectEnabled = acl.isRedirectEnabled || true; 
		acl.bodyExtractMethod = acl.bodyExtractMethod || "json"; 

		let respBody = null;
		let reqInit =  init || {};


		reqInit.method = method || "GET";
		let req = new HttpRequest (url, reqInit);		
		req.acl = acl;
		this.invokeFirstRequestMiddleware (req);

		let response = null; 

		//$(".spinner-overlay").removeClass("d-none");

		response = await fetch (req);
		response.acl = acl;
		response.outputAsArrayBuffer = null;
		response.outputAsBlob = null;
		response.outputAsText = null;
		response.outputAsFormData = null;
		response.outputAsJson = null;
		response.output = null;

		if(!response.ok){
			let data = await response.text(); 
			response.outputAsText = data;
			response.output = data;

			//return; // no more chaining through middlewares
		}
		else {
			switch (acl.bodyExtractMethod) {
				case 'arrayBuffer':
					response.outputAsArrayBuffer = await response.arrayBuffer ();
					response.output = response.outputAsArrayBuffer;
					break;
				case 'blob':
					response.outputAsBlob = await response.blob ();
					response.output = response.outputAsBlob;
					break;
				case 'text':
					response.outputAsText = await response.text ();
					response.output = response.outputAsText;
					break;
				case 'formData':
					response.outputAsFormData = await response.formData ();
					response.output = response.outputAsFormData;
					break;
				case 'json':
				default:
					response.outputAsJson = await response.json ();
					response.output = response.outputAsJson;
					break;
			}

			
		}
		
		this.invokeFirstResponseMiddleware (response);
		
		
		return response;
	}

}
