/// <reference path="../../declarations/jquery-1.8.d.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../services/youtube_service.ts" />

module Controllers {

	interface IVideoScope extends ng.IScope {
		videoURL:string;
		showVideo:bool;
		switchMode:()=>void;
	}

	export var VideoController:any = function($scope:IVideoScope, youtube:Services.IYoutubeService) {
		$scope.videoURL = "9bZkp7q19f0";
		youtube.load($scope.videoURL, 'ytplayer')
			.done(()=>{
				youtube.getPlayer().playVideo();
				youtube.getPlayer().mute();
			});
		youtube.atSecond(3,()=>{
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

}
