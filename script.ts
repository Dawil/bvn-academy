/// <reference path="jquery-1.8.d.ts" />
/// <reference path="youtube.d.ts" />

interface Window {
	frame: number;
	ytplayer: any;
	onYouTubePlayerReady: any;
}

declare var swfobject;

$(window).load(function(){
	// Load player
	var params = { allowScriptAccess: "always" };
	swfobject.embedSWF("http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer",
		"ytPlayer", "560", "315", "8", null, null, params);

	// On Load assign ytplayer
	window.onYouTubePlayerReady = function(playerId:string):void {
		window.ytplayer = document.getElementById( "ytPlayer" );
		Start();
	};

	// Helper functions
	function toggleVisible():void {
		var currentlyVisible = $(".visible");
		var currentlyInvisible = $(".invisible");
		currentlyVisible.removeClass("visible")
		.addClass("invisible");
		currentlyInvisible.removeClass("invisible")
		.addClass("visible");
	};

	function pauseOn(n:number):any {
		return setInterval( function():void {
			if ( window.ytplayer.getPlayerState() === 1 ) {
				if ( Math.abs( window.ytplayer.getCurrentTime() - n) < 0.25 ) {
					toggleVisible();
					window.ytplayer.pauseVideo();
					console.log("frame is", window.ytplayer.getCurrentTime());
				}
			}
		}, 500);
	}

	function resumeOnClick(event:JQueryEventObject):void {
		toggleVisible();
		console.log("frame is", window.ytplayer.getCurrentTime());
		window.ytplayer.seekTo(window.frame+0.25);
		window.ytplayer.playVideo();
	}

	// Start after player has loaded
	function Start():void {
		window.ytplayer.playVideo();
		pauseOn(3);
		$("#form").click(resumeOnClick);
	}
});
