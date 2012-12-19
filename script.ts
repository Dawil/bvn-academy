/// <reference path="jquery-1.8.d.ts" />
/// <reference path="youtube.d.ts" />

interface Window {
	ytplayer: any;
	onYouTubePlayerReady: any;
}

declare var swfobject;
var POLL_STEP:number = 250; // milliseconds
var HAS_ENDED:number = 0;
var IS_PLAYING:number = 1;
var IS_PAUSED:number = 2;
var timer:Timer=null;

function getNow():number { return +(new Date); }

class Timer {
	private INFINITY:number = 0;

	private tickHandlers:{ ():void; }[] = [];
	private completionHandlers:{ ():void; }[] = [];

	// ID of our timeout
	private intervalID:number;

	// how many times we've ticked
	private currentCount:number=0;

	// if we've a timeout running
	active:bool=false;

	constructor(private delay:number, private repeatCount?:number=0) {
	}

	private tick():void {
		this.currentCount++;
		if (this.repeatCount === this.INFINITY
				|| this.currentCount < this.repeatCount) {
			this.runTickers();
		} else {
			this.runCompletions();
			this.stop();
		}
	}

	private runTickers():void {
		this.tickHandlers.map( (handler) => handler() )
	}

	private runCompletions():void {
		this.completionHandlers.map( (handler) => handler() )
	}

	private createInterval(delay:number):number {
		return window.setInterval($.proxy(this.tick, this), delay);
	}

	private destroyInterval(id:number):void {
		window.clearInterval(id);
	}

	start():void {
		if (this.active === false) {
			this.intervalID = this.createInterval(this.delay);
			this.active = true;
		}
	}

	stop():void {
		if (this.active) {
			this.destroyInterval(this.intervalID);
			delete this.intervalID;
			this.active = false;
		}
	}

	reset():void {
		this.stop();
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
function pauseOn(n:number):void {
	timer = new Timer(POLL_STEP);
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
	$("button").click(function(){
		alert("Alart");
		toggleVisible();
	});
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
