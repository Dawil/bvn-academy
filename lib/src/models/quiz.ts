module Models {
	export interface Quiz {
		question:string;
		options:string[];
		correctOption:string;
		time:number;
		attempt:bool;
	}
}
