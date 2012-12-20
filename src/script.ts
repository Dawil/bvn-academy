/// <reference path="../declarations/jquery-1.8.d.ts" />
/// <reference path="../declarations/youtube.d.ts" />
/// <reference path="../declarations/angular-1.0.d.ts" />
/// <reference path="timer.ts" />
/// <reference path="controllers/video_controller.ts" />

interface Window {
	ytplayer: any;
	onYouTubePlayerReady: any;
}

declare var swfobject;
var POLL_STEP:number = 250; // milliseconds
var HAS_ENDED:number = 0;
var IS_PLAYING:number = 1;
var IS_PAUSED:number = 2;
var timer:Util.Timer=null;

// Helper functions
function pauseOn(n:number):void {
	timer = new Util.Timer(POLL_STEP);
	timer.onTick(() => {
		// in milliseconds
		var timeGap = 1000 * Math.abs( window.ytplayer.getCurrentTime() - n );
		if (timeGap < (POLL_STEP/2)) {
			toggleVisible();
		}
	});
	window.ytplayer.addEventListener('onStateChange', 'syncPlayer');
	//$("#formwrapper").click(() => toggleVisible());
}

function syncPlayer(state:number):void {
	if (state ===  IS_PAUSED) {
		timer.stop();
	} else if (state === IS_PLAYING) {
		timer.start();
	} else if (state === HAS_ENDED) {
		timer.stop();
	}
}

function toggleVisible():void {
	var currentlyVisible = $(".visible");
	var currentlyInvisible = $(".invisible");
	currentlyVisible.removeClass("visible")
		.addClass("invisible");
	currentlyInvisible.removeClass("invisible")
		.addClass("visible");
	if (window.ytplayer.getPlayerState() === IS_PLAYING) {
		window.ytplayer.pauseVideo();
	} else {
		window.ytplayer.playVideo();
	}
}

// Start after player has loaded
function Start():void {
	window.ytplayer.playVideo();
	pauseOn(3);
	//timer.start();
}

$(window).load(function(){
	// Load player
	var params = { allowScriptAccess: "always" };
	swfobject.embedSWF("http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer&version=3",
		"ytPlayer", "560", "315", "8", null, null, params);

	// On Load assign ytplayer
	window.onYouTubePlayerReady = function(playerId:string):void {
		window.ytplayer = document.getElementById( "ytPlayer" );
		Start();
	};
});
