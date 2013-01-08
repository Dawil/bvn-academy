/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube_service.ts" />
/// <reference path="../filters/quiz_filters.ts" />

module Controllers {

	export interface IVideoScope extends ng.IScope {
		videoURL:string;
		showVideo:bool;
		switchMode:()=>void;
		quizzes: Quiz[];
		selectedQuiz: Quiz;
		selectedOption: { str: string; };
		attemptQuiz: () => void;
	}

	export interface Quiz {
		question:string;
		options:string[];
		correctOption:string;
		time:number;
		attempt:bool;
	}

	export var VideoController:any = function($scope:IVideoScope,
			youtube:Services.IYoutubeService) {
		$scope.videoURL = "9bZkp7q19f0";
		$scope.selectedOption = { str: '' };
		$scope.quizzes = [
				{
					question: "Select the correct option:",
					options: [ "Correct", "Incorrect" ],
					correctOption: "Correct",
					time: 1,
					attempt: null
				},
				{
					question: "How many options are there?",
					options: [ "One" ],
					correctOption: "One",
					time: 7,
					attempt: null
				},
				{
					question: "What 'style' is this video?",
					options: [ "Gangnam Style", "Oppa Style", "K-POP Style",
						"BVN Donnovan Hill Style"],
					correctOption: "Gangnam Style",
					time: 12,
					attempt: null
				}
			];
		youtube.load($scope.videoURL, 'ytplayer')
			.done(()=>{
				youtube.getPlayer().playVideo();
				youtube.getPlayer().mute();
			});
		$scope.quizzes.map((quiz:Quiz):void => {
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
