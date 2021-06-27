class Class {
	constructor (arg) {
		//super ();
	}

}

class Ygte extends Class {
	constructor (arg) {
		super (arg);
	}

	renderSection (section, model = null) {
		let accu = '';
		for (let i of section.call (this, model)) {
			accu += i;
		}
		return accu;
	}

	render (model) {
		var yetAnotherTemplate = {
    		*myHeader (model) { 
				
			},
		}
		return this.renderSection (this.layout, model);

	}

}


class Template extends Ygte {
	constructor (arg) {
		super (arg);

		//this.fld = "Val";
	}

	*header (model) {
		yield `
			<title>Hello World</title>
		`;
	}

	*body (model) {
		//let f = this.fld;
		yield `
			<p><b>Hello<b>,
		`;
		yield `
			World</p>
		`;
	}

	*footer (model) {
		yield `
			<p>Bye</p>
		`;
	}

	*layout (model) {
		let f = this.fld;
		
		yield `
			<html>
				<head>
					${this.renderSection (this.header, model)}
				</head>
				<body>
					${this.renderSection (this.body, model)}
					<footer>
						${this.renderSection (this.footer, model)}
					</footer>
				</body>
			</html>
		`;
	}

}

let t = new Template ();
console.log (t.render ({}));