function getNow() {
    return +(new Date());
}
var Timer = (function () {
    function Timer(delay, repeatCount) {
        if (typeof repeatCount === "undefined") { repeatCount = 0; }
        this.delay = delay;
        this.repeatCount = repeatCount;
        this.INFINITY = 0;
        this.tickHandlers = [];
        this.completionHandlers = [];
        this.currentCount = 0;
        this.active = false;
    }
    Timer.prototype.tick = function () {
        this.currentCount++;
        if(this.repeatCount === this.INFINITY || this.currentCount < this.repeatCount) {
            this.runTickers();
        } else {
            this.runCompletions();
            this.stop();
        }
    };
    Timer.prototype.runTickers = function () {
        this.tickHandlers.map(function (handler) {
            return handler();
        });
    };
    Timer.prototype.runCompletions = function () {
        this.completionHandlers.map(function (handler) {
            return handler();
        });
    };
    Timer.prototype.createInterval = function (delay) {
        return window.setInterval($.proxy(this.tick, this), delay);
    };
    Timer.prototype.destroyInterval = function (id) {
        window.clearInterval(id);
    };
    Timer.prototype.start = function () {
        if(this.active === false) {
            this.intervalID = this.createInterval(this.delay);
            this.active = true;
        }
    };
    Timer.prototype.stop = function () {
        if(this.active) {
            this.destroyInterval(this.intervalID);
            delete this.intervalID;
            this.active = false;
        }
    };
    Timer.prototype.reset = function () {
        this.stop();
        this.currentCount = 0;
    };
    Timer.prototype.onTick = function (func) {
        this.tickHandlers.push(func);
    };
    Timer.prototype.onComplete = function (func) {
        this.completionHandlers.push(func);
    };
    return Timer;
})();
