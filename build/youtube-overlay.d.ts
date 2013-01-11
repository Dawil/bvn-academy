/// <reference path="angular-1.0.d.ts" />
/// <reference path="jquery-1.8.d.ts" />

var overlayModule: ng.IModule;
module Util {
    class Timer {
        private delay;
        private repeatCount;
        private INFINITY;
        private tickHandlers;
        private completionHandlers;
        private intervalID;
        private currentCount;
        public active: bool;
        constructor (delay: number, repeatCount?: number);
        private tick();
        private runTickers();
        private runCompletions();
        private createInterval(delay);
        private destroyInterval(id);
        public start(): void;
        public stop(): void;
        public reset(): void;
        public onTick(func: () => void): void;
        public onComplete(func: () => void): void;
    }
}
module Controllers {
    interface IQuizScope extends ng.IScope {
        selectedQuiz: Models.Quiz;
        selectedOption: {
            str: string;
        };
        attemptQuiz: () => void;
        quizMode: string;
        resume: () => void;
        retry: () => void;
        replay: () => void;
    }
    var QuizController: any;
}
module Controllers {
    interface IVideoScope extends ng.IScope {
        youtubeId: string;
        showVideo: () => bool;
        quizzes: Models.Quiz[];
        selectedQuiz: Models.Quiz;
    }
    var VideoController: any;
}
module Directives {
}
module Models {
    interface Quiz {
        question: string;
        options: string[];
        correctOption: string;
        time: number;
        attempt: bool;
    }
}
module Services {
    interface IYoutubeService {
        getPlayer: () => any;
        load: (video: string, id: string) => JQueryDeferred;
        atSecond: (n: number, handler: () => void) => void;
        hide: bool;
    }
}
