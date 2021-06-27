const BOX_PRIO = 100
const BOX_DEADLINE = 1
/**
 * @file boxTask
 * contains the Box type. It's a class representing the moving box on screen.
 * animationFn is a one shot very short REALTIME task, which moves the box. 
 * after it is finished, it will re-instate itself into the run-queue, on
 * the requestAnimationFrame - interrupt
 */
class Box extends CooperativeTask {
    constructor() {
        super({
            name: "BoxTask",
            priority: BOX_PRIO,
            deadline: BOX_DEADLINE
        })
 
        this.last = {
            x: 0,
            direction: "right"
        }

        this.box = document.querySelector("#box")
        this.last.x = box.offsetLeft;
    }

    
    *run () {
		let cx = 0;
		while (++cx > 0) {
			if (this.last.direction === "right") {
				//this.last.x += 10
				this.last.x += 1
				this.box.textContent = "I'm moving! /o/"
			} else {
				//this.last.x -= 10
				this.last.x -= 1
				this.box.textContent = "I'm moving! \\o\\"
			}

			//if (this.last.x >= window.innerWidth - this.box.clientWidth - 10 ) {
			if (this.last.x >= window.innerWidth - this.box.clientWidth - 1 ) {
				this.last.direction = "left"
			//} else if (this.last.x <= 10) {
			} 
			else if (this.last.x <= 1) {
				this.last.direction = "right"
			}

			this.box.style["left"] = this.last.x;

			if (cx % 1 == 0) {
				yield;
			}

			if (cx > 1000) {
				return;
			}
		}
    }

	/*
    addTask () {
        if ( this.rtjs != null ) {
            this.creationTime = performance.now();
            this.rtjs.addTask ( this );
        }

        //requestAnimationFrame(this.addTask.bind(this))
    }
	*/
    onTerminate () { }
}

