/// <reference path="jquery-1.8.d.ts" />
/// <reference path="youtube.d.ts" />

$(window).load(function(){
	// Load player
	var params = { allowScriptAccess: "always" };
	swfobject.embedSWF("http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer",
		"ytPlayer", "560", "315", "8", null, null, params);

	// On Load assign ytplayer
	window.onYouTubePlayerReady = function(playerId) {
		window.ytplayer = document.getElementById( "ytPlayer" );
		Start();
	};

	// Helper functions
	function toggleVisible() {
		var currentlyVisible = $(".visible");
		var currentlyInvisible = $(".invisible");
		currentlyVisible.removeClass("visible")
		.addClass("invisible");
		currentlyInvisible.removeClass("invisible")
		.addClass("visible");
	};

	function pauseOn(frame) {
		return function() {
		if (ytplayer.getPlayerState() === 1 && Math.round(ytplayer.getCurrentTime()) == frame) {
			ytplayer.pauseVideo();
			window.frame = ytplayer.getCurrentTime();
			toggleVisible();
		}
		};
	};

	function resumeOnClick(event) {
		toggleVisible();
		console.log("frame is", window.frame);
		ytplayer.seekTo(window.frame+1.1);
		ytplayer.playVideo();
	};
	// Start after player has loaded
	function Start() {
		ytplayer.playVideo();
		window.setInterval(pauseOn(3), 1000);
		$("#form").click(resumeOnClick);
		}
	}
);
