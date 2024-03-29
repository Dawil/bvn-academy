Items
=====

set up proper master/gh-pages distinction
use bootstrap css
+ add a progress bar of sorts with % correct, etc
create directives
group into atom: switch and pause in video controller
move the quizes out of the video controller into some fake loading service thingy
uss css preprocessor to dry things up
yeoman!!
document functions in video controller
it seems the player.atFrame doesn''t always avoid gettign stuck on itself
avoid magic number skip in #replayQuiz

Progress Bar
------------

As quizes are attempted the progress object is updated with the attempt

	<progressbar ng-repeat="quiz in quizzes">
		<marker attempt="{{ quiz.attempt }}">
		</marker>
	</progressbar>

	prgressbar {
		// has a thin bar through the middle
	}

	marker {
		// is a circle with a utf tick, cross or dot depending on the quiz.attempt
	}

Directives
----------

* progress bar
* video thingy

Goals for the Week
==================

Have an encapsulated widget that can be loaded by a single function from a single script.

    YoutubeOverlay.
		loadOverlay( elementId:string,	// element to be replaced with overlay
					 youtubeId:string,	// youtube video to be loaded
					 questionSet:Quiz[],
					 completionHandler:(Quiz[]) => void
				   )

Requirements
------------

* feature complete code
* download of production script
* documentation of `loadOverlay`
* documentation of quiz format
* alternative production script for use in other angularjs apps?

Roadblocks
----------

* 100% encapsulation of an angularjs widget
* loose coupling from the question set (via a service?)
* 2 stage quizzes (1 - attempt quiz, 2 - presented with success/failure and continue/replay)
* loose coupling from a completionHandler
* distinction between gh-pages branch and master branch

Goals for the Week -- Revision
==============================

Quick research seems to indicate that it is not simple to perfectly encapsulate an anguarjs app. This indicates that the correct way to share the YoutubeOverlay widget is as an angularjs directive inside an angularjs module.

e.g.

    <head>
        ...
        <script src="angular.js"></script>
		<script src="youtube-overlay.js"></script>
		<link href="overlay-style.css"/>
		<script>
			var youtubeId, quizSet, completionHandler;

			angular
				.module("myModule", ["youtubeOverlay"]) // modules
				.controller("OverlayController", // controller
					["$scope", "youtubeOverlay", // minify protection
					function($scope, overlay) {  // function definition
						// the good stuff
						overlay.init(youtubeId, quizSet, completionHandler);
					}]
				);
		</script>
		...
	</head>
	<body>
		...
		<div ng-app="myModule">
			<div youtube-overlay ng-controller="OverlayController">
			</div>
		</div>
		...
	</body>

where:

	youtubeId:string,
	quizSet:Quiz[],
	completionHandler:(completedQuizSet:AttemptedQuiz[]) => void

Requirements
------------

* feature complete code
* download of production script
* documentation of how to import (as above)
* documentation of quiz format
* typescript definition file

Roadblocks
----------

* encapsulation as an angularjs widget
* loose coupling from the question set in the code (via a service?)
* 2 stage quizzes (1 - attempt quiz, 2 - presented with success/failure and continue/replay)
* loose coupling from a completionHandler
* distinction between gh-pages branch and master branch
