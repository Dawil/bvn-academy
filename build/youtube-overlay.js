var overlayModule = angular.module("youtubeOverlay", []);
var Util;
(function (Util) {
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
    Util.Timer = Timer;    
})(Util || (Util = {}));
var Controllers;
(function (Controllers) {
    Controllers.QuizController = function ($scope, youtube) {
        $scope.quizMode = "attempting";
        $scope.selectedOption = {
            str: ''
        };
        $scope.attemptQuiz = function () {
            $scope.selectedQuiz.attempt = $scope.selectedQuiz.correctOption === $scope.selectedOption.str;
            if($scope.selectedQuiz.attempt) {
                $scope.quizMode = "correct";
            } else {
                $scope.quizMode = "incorrect";
            }
        };
        $scope.resume = function () {
            $scope.quizMode = "attempting";
            youtube.hide = false;
            youtube.getPlayer().playVideo();
        };
        $scope.retry = function () {
            $scope.quizMode = "attempting";
        };
        $scope.replay = function () {
            youtube.hide = false;
            var time = 0;
            youtube.getPlayer().seekTo(time);
            youtube.getPlayer().playVideo();
        };
    };
    Controllers.QuizController.$inject = [
        "$scope", 
        "youtube"
    ];
})(Controllers || (Controllers = {}));
var Controllers;
(function (Controllers) {
    Controllers.VideoController = function ($scope, youtube) {
        $scope.$watch('youtubeId', function (newValue, oldValue) {
            youtube.load($scope.youtubeId, 'ytplayer').done(function () {
                youtube.getPlayer().playVideo();
                youtube.getPlayer().mute();
            });
        });
        $scope.showVideo = function () {
            return !youtube.hide;
        };
        $scope.quizzes.map(function (quiz) {
            youtube.atSecond(quiz.time, function () {
                $scope.selectedQuiz = quiz;
                youtube.hide = true;
                youtube.getPlayer().pauseVideo();
                $scope.$digest();
            });
        });
    };
    Controllers.VideoController.$inject = [
        '$scope', 
        'youtube'
    ];
})(Controllers || (Controllers = {}));
var Directives;
(function (Directives) {
    overlayModule.directive('youtubeOverlay', function () {
        return {
            restrict: 'AC',
            replace: false,
            template: '<div ng-controller="Controllers.VideoController">' + '<div id="progressBar">' + '<div data-ng-repeat="quiz in quizzes"' + 'class="marker {{ quiz | toMarkerClass }}">' + '</div>' + '</div>' + '<div id="ytwrapper" class="visible-{{ showVideo() }}">' + '<div id="ytplayer"></div>' + '</div>' + '<div id="formwrapper" ng-controller="Controllers.QuizController"' + 'class="visible-{{ !showVideo() }}">' + '<div ng-switch on="quizMode">' + '<form ng-switch-when="attempting" name="quiz" action="">' + '<p>{{ selectedQuiz.question }}</p>' + '<span data-ng-repeat="option in selectedQuiz.options">' + '<input type="radio" data-ng-model="selectedOption.str"' + 'value="{{ option }}" name="option">' + '{{ option }}<br>' + '</span>' + '<button name="button" data-ng-click="attemptQuiz()">' + 'OK' + '</button>' + '<button name="button2" ng-click="replay()">' + 'Play Again' + '</button>' + '</form>' + '<div ng-switch-when="correct">' + '<p>Good job!</p>' + '<button ng-click="resume()">Continue</button>' + '</div>' + '<div ng-switch-when="incorrect">' + '<p>Incorrect.</p>' + '<button ng-click="resume()">Continue Anyway</button>' + '<button ng-click="retry()">Try Again</button>' + '<button ng-click="replay()">Replay Video</button>' + '</div>' + '</div>' + '</div>' + '</div>'
        };
    });
})(Directives || (Directives = {}));
overlayModule.filter('toMarkerClass', function () {
    return function (input) {
        if(input.attempt) {
            return 'completed-quiz';
        } else {
            if(input.attempt == false) {
                return 'failed-quiz';
            } else {
                if(input.attempt == null) {
                    return 'unattempted-quiz';
                } else {
                    return '';
                }
            }
        }
    }
});
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
