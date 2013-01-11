var Services;
(function (Services) {
    var POLL_STEP = 250;
    var HAS_ENDED = 0;
    var IS_PLAYING = 1;
    var IS_PAUSED = 2;
    overlayModule.factory('youtube', function () {
        var timer = new Util.Timer(POLL_STEP);
        var player;
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
                var deferred = $.Deferred();
                var params = {
                    allowScriptAccess: "always"
                };
                (window).onYouTubePlayerReady = function () {
                    player = document.getElementById(id);
                    player.addEventListener('onStateChange', 'onStateChangeHandler');
                    deferred.resolve();
                };
                swfobject.embedSWF("http://www.youtube.com/v/" + video + "&enablejsapi=1&version=3", id, "560", "315", "8", null, null, params);
                return deferred;
            },
            atSecond: function (n, handler) {
                timer.onTick(function () {
                    if(player) {
                        var timeGap = 1000 * Math.abs(player.getCurrentTime() - n);
                        if(timeGap < (POLL_STEP / 2)) {
                            handler();
                        }
                    }
                });
            },
            hide: false
        };
        return youtube;
    });
})(Services || (Services = {}));
