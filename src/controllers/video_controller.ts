/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />

interface IVideoScope extends ng.IScope {
	videoURL:string;
	showVideo:bool;
	switchMode:()=>void;
}

function VideoController($scope:IVideoScope) {
	var VIDEO_MODE:string = 'video';
	var FORM_MODE :string = 'form';
	$scope.videoURL = "http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer&version=3"
	$scope.showVideo = true;
	$scope.switchMode = () => {
		$scope.showVideo = !$scope.showVideo;
	};
}
