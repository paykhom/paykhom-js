

function main () {
    evlo = new EventLoop ({
        scheduler: {
            policy: "EDF",
            debug: false,
            meanTimeToYield: 1,
            numOfTicksBeforeReschedule: 300
        }
    })

    b = new Box();
    evlo.addTask(b);

    n = new Numbers ();
    real.addTask(n);
    evlo.start();
}

window.onload = main;
