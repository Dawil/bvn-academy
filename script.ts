/// <reference path="jquery-1.8.d.ts" />
/// <reference path="youtube.d.ts" />

interface Window {
	ytplayer: any;
	onYouTubePlayerReady: any;
}

declare var swfobject;
var POLL_STEP:number = 0.5; // seconds
var IS_PLAYING:number = 1;
var IS_PAUSED:number = 2;

class Timer {
	private INFINITY:number = 0;

	private tickHandlers:{ ():void; }[];
	private completionHandlers:{ ():void; }[];

	// ID of our timeout
	private timeoutID:number;

	// how many times we've ticked
	private currentCount:number=0;

	// the last time we ticked
	// null if we've never started
	private last:number=null;

	// says how long we have left until a tick
	// null if we're active
	private remaining:number=null;

	// if we've a timeout running
	private active:bool=false;

	constructor(private delay:number, private repeatCount?:number=0) {
	}

	private tick():void {
		this.currentCount++;
		this.last = this.getNow();
		if (this.repeatCount === this.INFINITY
				|| this.currentCount < this.repeatCount) {
			this.runTickers();
		} else {
			this.stop();
			this.runCompletions();
		}
	}

	private getNow():number { return +(new Date); }

	private runTickers():void {
		this.tickHandlers.map( (handler) => handler() )
	}

	private runCompletions():void {
		this.completionHandlers.map( (handler) => handler() )
	}

	start():void {
		if (this.active === false) {
			if (this.last !== null) {
				// start for the first time
				this.timeoutID = window.setTimeout(this.tick, this.delay);
				this.last = this.getNow();
			} else {
				// resume from last
				this.timeoutID = window.setTimeout(this.tick, this.remaining);
				this.remaining = null;
			}
			this.active = true;
		}
	}

	stop():void {
		// TODO decide which order to execute these in
		var now:number = this.getNow();
		window.clearTimeout(this.timeoutID);

		this.remaining = now - this.last;
		this.last = now;
		this.active = false;
	}

	reset():void {
		this.stop();
		this.last = null;
		this.remaining = null;
		this.currentCount = 0;
	}

	onTick(func:() => void):void {
		this.tickHandlers.push(func);
	}

	onComplete(func:() => void):void {
		this.completionHandlers.push(func);
	}
}

// Helper functions
function pauseOn(n:number):any {
	var poll = function():any {
		return setInterval( function():void {
			if ( window.ytplayer.getPlayerState() === IS_PLAYING ) {
				var timeGap = Math.abs( window.ytplayer.getCurrentTime() - n );
				if ( timeGap < (POLL_STEP/2) ) {
					toggleVisible();
					//window.ytplayer.pauseVideo();
					console.log("frame is", window.ytplayer.getCurrentTime());
				}
			}
		}, POLL_STEP*1000);
	}
	var intervalID = poll();
	window.ytplayer.addEventListener('onStateChange', function():void {
		var state = window.ytplayer.getPlayerState();
		if ( state === IS_PLAYING && intervalID == null) {
			intervalID = poll();	
		} else if ( state === IS_PAUSED ) {
			clearInterval( intervalID );
			intervalID = null;
		}
	});
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

function resumeOnClick(event:JQueryEventObject):void {
	toggleVisible();
	console.log("frame is", window.ytplayer.getCurrentTime());
	//window.ytplayer.seekTo( window.ytplayer.getCurrentTime() + (POLL_STEP/2) );
	//window.ytplayer.playVideo();
}

// Start after player has loaded
function Start():void {
	window.ytplayer.playVideo();
	pauseOn(3);
	$("#form").click(resumeOnClick);
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
