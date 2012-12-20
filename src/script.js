var POLL_STEP = 250;
var HAS_ENDED = 0;
var IS_PLAYING = 1;
var IS_PAUSED = 2;
var timer = null;
function pauseOn(n) {
    timer = new Util.Timer(POLL_STEP);
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
    window.ytplayer.playVideo();
    pauseOn(3);
}
