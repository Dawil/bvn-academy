var POLL_STEP = 250;
var HAS_ENDED = 0;
var IS_PLAYING = 1;
var IS_PAUSED = 2;
var timer = null;
academyModule.factory('youtube', function () {
    var timer = new Util.Timer(POLL_STEP);
    var player;
    var onPlayerLoadCallback = function () {
    };
    var syncPlayer = function (state) {
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
    };
    (window).onStateChangeHandler = function (state) {
        syncPlayer(state);
    };
    var youtube = {
        getPlayer: function () {
            return player;
        },
        load: function (video, id) {
            var params = {
                allowScriptAccess: "always"
            };
            (window).onYouTubePlayerReady = function () {
                player = document.getElementById(id);
                player.addEventListener('onStateChange', 'onStateChangeHandler');
                onPlayerLoadCallback();
            };
            swfobject.embedSWF("http://www.youtube.com/v/" + video + "&enablejsapi=1&version=3", id, "560", "315", "8", null, null, params);
        },
        setOnLoadCallback: function (callback) {
            onPlayerLoadCallback = callback;
        },
        onFrame: function (n, handler) {
            if(player) {
                timer.onTick(function () {
                    var timeGap = 1000 * Math.abs(player.getCurrentTime() - n);
                    if(timeGap < (POLL_STEP / 2)) {
                        handler();
                    }
                });
            }
        }
    };
    return youtube;
});
