/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube.ts" />

interface IVideoScope extends ng.IScope {
	videoURL:string;
	showVideo:bool;
	switchMode:()=>void;
}

var VideoController:any = function($scope:IVideoScope, youtube:any) {
	$scope.videoURL = "9bZkp7q19f0";
	youtube.load($scope.videoURL, 'ytplayer')
		.then(()=>{
			youtube.getPlayer().playVideo();
			youtube.getPlayer().mute();
		});
	youtube.onSecond(3,()=>{
		$scope.showVideo = false;
		youtube.getPlayer().pauseVideo();
		$scope.$digest();
	});
	$scope.showVideo = true;
	$scope.switchMode = () => {
		$scope.showVideo = !$scope.showVideo;
	};
}
VideoController.$inject = ['$scope', 'youtube'];
