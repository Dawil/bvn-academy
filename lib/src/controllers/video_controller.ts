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
