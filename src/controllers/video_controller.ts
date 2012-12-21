/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube_service.ts" />

module Controllers {

	export interface IVideoScope extends ng.IScope {
		videoURL:string;
		showVideo:bool;
		switchMode:()=>void;
		quizzes: Quiz[];
		selectedQuiz: Quiz;
		selectedOption: string;
		attemptQuiz: () => void;
	}

	export interface Quiz {
		question:string;
		options:string[];
		correctOption:string;
		time:number;
	}

	export var VideoController:any = function($scope:IVideoScope,
			youtube:Services.IYoutubeService) {
		$scope.videoURL = "9bZkp7q19f0";
		$scope.quizzes = [
				{
					question: "Select the correct option:",
					options: [ "Correct", "Incorrect" ],
					correctOption: "Correct",
					time: 3
				},
				{
					question: "How many options are there?",
					options: [ "One" ],
					correctOption: "One",
					time: 7
				},
				{
					question: "What 'style' is this video?",
					options: [ "Gangnam Style", "Oppa Style", "K-POP Style",
						"BVN Donnovan Hill Style"],
					correctOption: "Gangnam Style",
					time: 12
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
			if ($scope.selectedOption === $scope.selectedQuiz.correctOption) {
				alert("Yay, correct.");
			} else {
				alert("Boo, wrong.");
			}
		};
		$scope.showVideo = true;
		$scope.switchMode = () => {
			$scope.showVideo = !$scope.showVideo;
		};
	};
	VideoController.$inject = ['$scope', 'youtube'];

}
