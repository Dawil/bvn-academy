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
		'<div id="ytwrapper" class="visible-{{ showVideo }}">' +
			'<div id="ytplayer"></div>' +
		'</div>' +
		'<div id="formwrapper" class="visible-{{ !showVideo }}">' +
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
