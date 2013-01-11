BVN Academy - Youtube Overlay
===========

The Youtube Overlay is an angularjs module to help you add simple multiple choice questions to a youtube video.

Usage
=====

Dependencies
------------

The Youtube Overlay relies on several projects. You will need to include them in your html:

* jquery - CDN: http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
* angularjs - CDN: http://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.min.js
* swfobject - CDN: http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js

CSS Rules
---------

There is an example css file in the build directory for styling your overlay:

	.visibile-true {
		position: relative;
		top: 0px;
		right: 0px;
	}

	.visible-false {
		position: absolute;
		top: -1000px;
		right: -1000px;
	}

	#ytwrapper, #formwrapper {
		height: 320;
		display:block;
	}

	#progressBar {
		width: 560px;
		height: 20px;
		background-color: gray;
		display: -moz-box;
		display: -webkit-box;
		display: box;
	}

	.marker {
		text-align: center;
		-moz-box-flex: 1;
		-webkit-box-flex: 1;
		box-flex: 1;
	}

	.completed-quiz {
		background-color: green;
	}

	.completed-quiz:after {
		content: "✔";
	}

	.completed-quiz:hover {
		box-shadow: 0 0 5px green;
	}

	.failed-quiz {
		background-color: red;
	}

	.failed-quiz:after {
		content: "✘";
	}

	.failed-quiz:hover {
		box-shadow: 0 0 5px red;
	}

	.unattempted-quiz:after {
		content: "•";
	}

	.unattempted-quiz:hover {
		box-shadow: 0 0 5px gray;
	}

Example
-------

The Youtube Overlay is also an angularjs module. This means that you need to incorporate it into your angularjs code. Below is an example of minimal usage using the example style provided:

    <!DOCTYPE html>
	<html ng-app="myApp">
		<head>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.0.3/angular.min.js"></script>
			<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
			<script type="text/javascript">
				var quizSet, youtubeId, completionHandler;
				angular
					.module("myApp", ["youtubeOverlay"]);

				function MainController($scope) {
					$scope.quizzes = quizSet;
					$scope.youtubeId = youtubeId;
					$scope.completionHandler = completionHandler;
				}
			</script>
			<link href="style/style.css" media="screen" rel="stylesheet" type="text/css" />
		</head>
		<body>
			<div youtube-overlay ng-controller="MainController">
			</div>
		</body>
	</html>

Quiz Format
===========

The quiz format is:

	{
		question: "A string",
		options: [
			"Several",
			"options", // <-- the correct option
			"to choose",
			"from"
		],
		correctOption: "options", // same as the correct option
		time: 5, // time in seconds at which this question should be asked
		attempt: false // whether this quiz was answered correctly. 
					   // use null if not attempted
	}

There is an example of the quiz format in `config.js`:

	var youtubeId = "9bZkp7q19f0",
		quizSet = [
				{
					question: "Select the correct option:",
					options: [
						"Correct", 
						"Incorrect"
					],
					correctOption: "Correct",
					time: 1,
					attempt: null
				}, 
				{
					question: "How many options are there?",
					options: [
						"One"
					],
					correctOption: "One",
					time: 7,
					attempt: null
				}, 
				{
					question: "What 'style' is this video?",
					options: [
						"Gangnam Style", 
						"Oppa Style", 
						"K-POP Style", 
						"BVN Donnovan Hill Style"
					],
					correctOption: "Gangnam Style",
					time: 12,
					attempt: null
				}
			],
		completionHandler = function(attemptedQuizSet){console.log("DONE!")};

Typescript Declarations
=======================

Because this project was written in Typescript, there is also a typescript declaration file in the build directory, if desired.
Todo
====

* `completionHandler` doesn't work
* will sometimes pause the video twice for the same question
* use a proper build system (e.g. yeoman)
* `play again` isn't implemented
* put the css for hiding the player inside the js script
