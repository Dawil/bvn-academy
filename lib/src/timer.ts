/// <reference path="../declarations/jquery-1.8.d.ts" />

module Util {

	function getNow():number { return +(new Date); }

	export class Timer {
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
}
