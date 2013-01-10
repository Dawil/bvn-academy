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
