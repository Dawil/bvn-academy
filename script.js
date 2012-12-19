var POLL_STEP = 250;
var HAS_ENDED = 0;
var IS_PLAYING = 1;
var IS_PAUSED = 2;
var timer = null;
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
function pauseOn(n) {
    timer = new Timer(POLL_STEP);
    timer.onTick(function () {
        var timeGap = 1000 * Math.abs(window.ytplayer.getCurrentTime() - n);
        if(timeGap < (POLL_STEP / 2)) {
            toggleVisible();
        }
    });
    window.ytplayer.addEventListener('onStateChange', 'syncPlayer');
}
function syncPlayer(state) {
    if(state === IS_PAUSED) {
        timer.stop();
    } else {
        if(state === IS_PLAYING) {
            timer.start();
        } else {
            if(state === HAS_ENDED) {
                timer.stop();
            }
        }
    }
}
function toggleVisible() {
    var currentlyVisible = $(".visible");
    var currentlyInvisible = $(".invisible");
    currentlyVisible.removeClass("visible").addClass("invisible");
    currentlyInvisible.removeClass("invisible").addClass("visible");
    if(window.ytplayer.getPlayerState() === IS_PLAYING) {
        window.ytplayer.pauseVideo();
    } else {
        window.ytplayer.playVideo();
    }
}
function Start() {
    $("button").click(function () {
        alert("Alart");
        toggleVisible();
    });
    window.ytplayer.playVideo();
    pauseOn(3);
}
$(window).load(function () {
    var params = {
        allowScriptAccess: "always"
    };
    swfobject.embedSWF("http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer&version=3", "ytPlayer", "560", "315", "8", null, null, params);
    window.onYouTubePlayerReady = function (playerId) {
        window.ytplayer = document.getElementById("ytPlayer");
        Start();
    };
});
