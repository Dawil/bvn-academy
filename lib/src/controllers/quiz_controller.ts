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

