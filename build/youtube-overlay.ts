/// <reference path="../declarations/jquery-1.8.d.ts />
/// <reference path="../declarations/angular-1.0.d.ts" />

var overlayModule = angular.module("youtubeOverlay", []);
/// <reference path="../declarations/jquery-1.8.d.ts" />

module Util {

	function getNow():number { return +(new Date); }

	export class Timer {
		private INFINITY:number = 0;

		private tickHandlers:{ ():void; }[] = [];
		private completionHandlers:{ ():void; }[] = [];

		// ID of our timeout
		private intervalID:number;

		// how many times we've ticked
		private currentCount:number=0;

		// if we've a timeout running
		active:bool=false;

		constructor(private delay:number, private repeatCount?:number=0) {
		}

		private tick():void {
			this.currentCount++;
			if (this.repeatCount === this.INFINITY
					|| this.currentCount < this.repeatCount) {
				this.runTickers();
			} else {
				this.runCompletions();
				this.stop();
			}
		}

		private runTickers():void {
			this.tickHandlers.map( (handler) => handler() )
		}

		private runCompletions():void {
			this.completionHandlers.map( (handler) => handler() )
		}

		private createInterval(delay:number):number {
			return window.setInterval($.proxy(this.tick, this), delay);
		}

		private destroyInterval(id:number):void {
			window.clearInterval(id);
		}

		start():void {
			if (this.active === false) {
				this.intervalID = this.createInterval(this.delay);
				this.active = true;
			}
		}

		stop():void {
			if (this.active) {
				this.destroyInterval(this.intervalID);
				delete this.intervalID;
				this.active = false;
			}
		}

		reset():void {
			this.stop();
			this.currentCount = 0;
		}

		onTick(func:() => void):void {
			this.tickHandlers.push(func);
		}

		onComplete(func:() => void):void {
			this.completionHandlers.push(func);
		}
	}
}
/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../filters/quiz_filters.ts" />
/// <reference path="../models/quiz.ts" />

module Controllers {

	export interface IQuizScope extends ng.IScope {
		selectedQuiz:Models.Quiz;
		selectedOption: { str: string; };
		attemptQuiz: () => void;
		quizMode:string;
		resume:()=>void;
		retry:()=>void;
		replay:()=>void;
	}

	export var QuizController:any = function(
			$scope:IQuizScope,
			youtube:Services.IYoutubeService) {
		$scope.quizMode = "attempting";
		$scope.selectedOption = { str: '' };
		$scope.attemptQuiz = () => {
			$scope.selectedQuiz.attempt =
				$scope.selectedQuiz.correctOption === $scope.selectedOption.str;
			if ($scope.selectedQuiz.attempt) {
				$scope.quizMode = "correct";
			} else {
				$scope.quizMode = "incorrect";
			}
		};
		$scope.resume = () => {
			$scope.quizMode = "attempting";
			youtube.hide = false;
			youtube.getPlayer().playVideo();
		};
		$scope.retry = () => {
			$scope.quizMode = "attempting";
		};
		$scope.replay = () => {
			youtube.hide = false;
			var time = 0;
			youtube.getPlayer().seekTo( time );
			youtube.getPlayer().playVideo();
		};
	};
	QuizController.$inject = ["$scope", "youtube"];
}

/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube_service.ts" />
/// <reference path="../filters/quiz_filters.ts" />
/// <reference path="../models/quiz.ts" />

module Controllers {

	export interface IVideoScope extends ng.IScope {
		youtubeId:string;
		showVideo:() => bool;
		quizzes: Models.Quiz[];
		selectedQuiz: Models.Quiz;
	}

	export var VideoController:any = function($scope:IVideoScope,
			youtube:Services.IYoutubeService) {
		$scope.$watch('youtubeId', (newValue, oldValue) => {
			youtube.load($scope.youtubeId, 'ytplayer') //TODO remove hardcode
				.done(()=>{
					youtube.getPlayer().playVideo();
					youtube.getPlayer().mute();
				});
		});
		$scope.showVideo = () => { return !youtube.hide; };
		$scope.quizzes.map((quiz:Models.Quiz):void => {
			youtube.atSecond(quiz.time,()=>{
				$scope.selectedQuiz = quiz;
				youtube.hide = true;
				youtube.getPlayer().pauseVideo();

				$scope.$digest();
			});
		});
	};
	VideoController.$inject = ['$scope', 'youtube'];

}
/// <reference path="../overlay.ts"/>

module Directives {
	overlayModule.directive('youtubeOverlay', () => {
		return {
			restrict: 'AC',
			replace: false,
			template: 
	'<div ng-controller="Controllers.VideoController">' +
		'<div id="progressBar">' +
			'<div data-ng-repeat="quiz in quizzes"' +
				'class="marker {{ quiz | toMarkerClass }}">' +
			'</div>' +
		'</div>' +
		'<div id="ytwrapper" class="visible-{{ showVideo() }}">' +
			'<div id="ytplayer"></div>' +
		'</div>' +
		'<div id="formwrapper" ng-controller="Controllers.QuizController"' +
				'class="visible-{{ !showVideo() }}">' +
			'<div ng-switch on="quizMode">' +
				'<form ng-switch-when="attempting" name="quiz" action="">' +
					'<p>{{ selectedQuiz.question }}</p>' +
					'<span data-ng-repeat="option in selectedQuiz.options">' +
						'<input type="radio" data-ng-model="selectedOption.str"' +
								'value="{{ option }}" name="option">' +
							'{{ option }}<br>' +
					'</span>' +
					'<button name="button" data-ng-click="attemptQuiz()">' +
						'OK' +
					'</button>' +
					'<button name="button2" ng-click="replay()">' +
						'Play Again' +
					'</button>' +
				'</form>' +
				'<div ng-switch-when="correct">' +
					'<p>Good job!</p>' +
					'<button ng-click="resume()">Continue</button>' +
				'</div>' +
				'<div ng-switch-when="incorrect">' +
					'<p>Incorrect.</p>' +
					'<button ng-click="resume()">Continue Anyway</button>' +
					'<button ng-click="retry()">Try Again</button>' +
					'<button ng-click="replay()">Replay Video</button>' +
				'</div>' +
			'</div>' +
		'</div>' +
	'</div>'
		};
	});
}
/// <reference path="../controllers/video_controller.ts" />
/// <reference path="../models/quiz.ts" />
/// <reference path="../overlay.ts" />

overlayModule
	.filter('toMarkerClass', function() {
		return function(input:Models.Quiz) {
			if (input.attempt) {
				return 'completed-quiz';
			} else if (input.attempt == false) {
				return 'failed-quiz';
			} else if (input.attempt == null) {
				return 'unattempted-quiz'
			} else {
				return '';
			}
		};
	});
module Models {
	export interface Quiz {
		question:string;
		options:string[];
		correctOption:string;
		time:number;
		attempt:bool;
	}
}
/// <reference path="../timer.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../overlay.ts" />

module Services {

	declare var swfobject;
	var POLL_STEP:number = 250; //milliseconds
	var HAS_ENDED:number = 0;
	var IS_PLAYING:number = 1;
	var IS_PAUSED:number = 2;

	export interface IYoutubeService {
		getPlayer: () => any;
		load: (video:string, id:string) => JQueryDeferred;
		atSecond: (n:number, handler:()=>void) => void;
		hide: bool;
	}

	overlayModule.factory('youtube', () => {
		var timer:Util.Timer = new Util.Timer(POLL_STEP);
		var player;
		var syncPlayer:(state:number)=>void = (state:number):void => {
			if (state === IS_PAUSED) {
				timer.stop();
			} else if (state === IS_PLAYING) {
				timer.start();
			} else if (state === HAS_ENDED) {
				timer.stop();
			}
		};
		(<any>window).onStateChangeHandler = (state:number):void {
			syncPlayer(state);
		};
		var youtube:IYoutubeService = {
			getPlayer: () => { return player; },
			load: (video:string, id:string):JQueryDeferred => {
				var deferred:JQueryDeferred = $.Deferred();
				var params = { allowScriptAccess: "always" };
				(<any>window).onYouTubePlayerReady = ()=>{
					player = document.getElementById(id);
					player.addEventListener('onStateChange', 'onStateChangeHandler');
					deferred.resolve();
				};
				swfobject.embedSWF("http://www.youtube.com/v/" + video
					+ "&enablejsapi=1&version=3",
					id, "560", "315", "8", null, null, params);
				return deferred;
			},
			atSecond: (n:number, handler:()=>void):void => {
				timer.onTick(() => {
					if (player) {
						// in milliseconds
						var timeGap = 1000 * Math.abs( player.getCurrentTime() - n );
						if (timeGap < (POLL_STEP/2)) {
							handler();
						}
					}
				});
			},
			hide: false
		};
		return youtube;
	});
}
