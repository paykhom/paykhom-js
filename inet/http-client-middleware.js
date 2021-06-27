'use strict';

class HttpClientMiddleware extends Class {
	constructor (config) {
		super ();
		this.config = config;
	}

    async onRequest (req, next) {
        /* IMPLEMENT in your own Class
        */
    	next (req);
	   	return this;
	}

    async onResponse (response, next) {
        /* IMPLEMENT in your own Class
        */
		let data = null;
        if (response.acl.isRedirectEnabled && response.redirected) {
            window.location.href = response.url;
			return; // no more chaining through middlewares
        }

		if(!response.ok){
			let data = response.output; 
			/*
			$(document).Toasts('create', {
				class: 'bg-danger', 
				title: resp.statusText,
				//subtitle: resp.status,
				autohide: true,
				delay: 2000,
				body: null,
			});
			*/
			if (response.acl.isErrorMessageEnabled) {
				console.log (response.status);
				console.log (response.statusText);
				console.log (data);
				

				let s = data;
				let s1 = "ERROR: ";
				let s2 = "<br />";

				let l1 = s1.length;
				let l2 = s2.length;

				let p1 = s.indexOf (s1);
				let p2 = s.indexOf (s2);

				let s9 = s.substr (p1+l1, p2-p1-l1);		
				
				
				throw new Error ("HTTP " + response.status + ": " + response.statusText + (s.indexOf ('Query failed: ERROR:') > 0)? ": " + s9: "");
				// throw ("Error");
			}

			//return; // no more chaining through middlewares
		}
		else {
			if (response.acl.isSuccessMessageEnabled) {
				$(document).Toasts('create', {
						class: 'bg-success', 
						title: 'Sucess',
						//subtitle: '200',
						autohide: true,
						delay: 2000,
						body: 'Great!',
				});
			}
			
		}
	   

        next (response);
		return this;
    }

 
}
