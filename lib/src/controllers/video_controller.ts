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
	}

	export var VideoController:any = function($scope:IVideoScope,
			youtube:Services.IYoutubeService) {
		$scope.selectedOption = { str: '' };
		$scope.$watch('youtubeId', (newValue, oldValue) => {
			youtube.load($scope.youtubeId, 'ytplayer') //TODO remove hardcode
				.done(()=>{
					youtube.getPlayer().playVideo();
					youtube.getPlayer().mute();
				});
		});
		$scope.quizzes.map((quiz:Models.Quiz):void => {
			youtube.atSecond(quiz.time,()=>{
				$scope.selectedQuiz = quiz;
				$scope.showVideo = false;
				youtube.getPlayer().pauseVideo();

				$scope.$digest();
			});
		});
		$scope.attemptQuiz = () => {
			$scope.selectedQuiz.attempt =
				$scope.selectedOption.str === $scope.selectedQuiz.correctOption;
			$scope.switchMode();
			youtube.getPlayer().playVideo();
		};
		$scope.showVideo = true;
		$scope.switchMode = () => {
			$scope.showVideo = !$scope.showVideo;
		};
	};
	VideoController.$inject = ['$scope', 'youtube'];

}
