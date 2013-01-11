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

Todo
====

* `completionHandler` doesn't work
* will sometimes pause the video twice for the same question
