/// <reference path="../timer.ts" />
/// <reference path="../../declarations/angular-1.0.d.ts" />
/// <reference path="../academy.ts" />

declare var swfobject;
var POLL_STEP:number = 250; //milliseconds
var HAS_ENDED:number = 0;
var IS_PLAYING:number = 1;
var IS_PAUSED:number = 2;
var timer:Util.Timer=null;

interface IYoutubeService {
	getPlayer: () => any;
	load: (video:string, id:string) => void;
	setOnLoadCallback: (callback:()=>void) => void;
	onFrame: (n:number, handler:()=>void) => void;
}

academyModule.factory('youtube', () => {
	var timer:Util.Timer = new Util.Timer(POLL_STEP);
	var player;
	var onPlayerLoadCallback:()=>void = ()=>{};
	var syncPlayer:(state:number)=>void = (state:number):void => {
		if (state === IS_PAUSED) {
			timer.stop();
		} else if (state === IS_PLAYING) {
			timer.start();
		} else if (state === HAS_ENDED) {
			timer.stop();
		}
	};
	(<any>window).onStateChangeHandler = (state:number):void {
		syncPlayer(state);
	};
	var youtube:IYoutubeService = {
		getPlayer: () => { return player; },
		load: (video:string, id:string):void => {
			var params = { allowScriptAccess: "always" };
			(<any>window).onYouTubePlayerReady = ()=>{
				player = document.getElementById(id);
				player.addEventListener('onStateChange', 'onStateChangeHandler');
				onPlayerLoadCallback();
			};
			swfobject.embedSWF("http://www.youtube.com/v/" + video
				+ "&enablejsapi=1&version=3",
				id, "560", "315", "8", null, null, params);
		},
		setOnLoadCallback: (callback:()=>void):void => {
			onPlayerLoadCallback = callback;
		},
		onFrame: (n:number, handler:()=>void):void => {
			if (player) {
				timer.onTick(() => {
					// in milliseconds
					var timeGap = 1000 * Math.abs( player.getCurrentTime() - n );
					if (timeGap < (POLL_STEP/2)) {
						handler();
					}
				});
			}
		}
	};
	return youtube;
});
