/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube_service.ts" />
/// <reference path="../services/quiz_loader.ts" />
/// <reference path="../filters/quiz_filters.ts" />
/// <reference path="../models/quiz.ts" />

module Controllers {

	export interface IVideoScope extends ng.IScope {
		youtubeId:string;
		showVideo:bool;
		switchMode:()=>void;
		quizzes: Models.Quiz[];
		selectedQuiz: Models.Quiz;
		selectedOption: { str: string; };
		attemptQuiz: () => void;
		quizMode:string;
		resume:()=>void;
		retry:()=>void;
		replay:()=>void;
	}

	export var VideoController:any = function($scope:IVideoScope,
			youtube:Services.IYoutubeService) {
		$scope.selectedOption = { str: '' };
		$scope.quizMode = "attempting";
		$scope.$watch('youtubeId', (newValue, oldValue) => {
			youtube.load($scope.youtubeId, 'ytplayer') //TODO remove hardcode
				.done(()=>{
					youtube.getPlayer().playVideo();
					youtube.getPlayer().mute();
				});
		});
		$scope.quizzes.map((quiz:Models.Quiz):void => {
			youtube.atSecond(quiz.time,()=>{
				$scope.quizMode = "attempting";
				$scope.selectedQuiz = quiz;
				$scope.showVideo = false;
				youtube.getPlayer().pauseVideo();

				$scope.$digest();
			});
		});
		$scope.attemptQuiz = () => {
			$scope.selectedQuiz.attempt =
				$scope.selectedOption.str === $scope.selectedQuiz.correctOption;
			if ($scope.selectedQuiz.attempt) {
				$scope.quizMode = "correct";
			} else {
				$scope.quizMode = "incorrect";
			}
		};
		$scope.resume = () => {
			$scope.showVideo = true;
			youtube.getPlayer().playVideo();
		};
		$scope.retry = () => {
			$scope.quizMode = "attempting";
		};
		$scope.replay = () => {
			$scope.showVideo = true;
			var time = 0;
			youtube.getPlayer().seekTo( time );
			youtube.getPlayer().playVideo();
		};
		$scope.showVideo = true;
		$scope.switchMode = () => {
			$scope.showVideo = !$scope.showVideo;
		};
	};
	VideoController.$inject = ['$scope', 'youtube'];

}
