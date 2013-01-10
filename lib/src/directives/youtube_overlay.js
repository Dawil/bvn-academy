var Directives;
(function (Directives) {
    overlayModule.directive('youtubeOverlay', function () {
        return {
            restrict: 'AC',
            replace: false,
            template: '<div ng-controller="Controllers.VideoController">' + '<div id="ytwrapper" class="visible-{{ showVideo }}">' + '<div id="ytplayer"></div>' + '</div>' + '<div id="formwrapper" class="visible-{{ !showVideo }}">' + '<form name="quiz" action="">' + '<p>{{ selectedQuiz.question }}</p>' + '<span data-ng-repeat="option in selectedQuiz.options">' + '<input type="radio" data-ng-model="selectedOption.str"' + 'value="{{ option }}" name="option">' + '{{ option }}<br>' + '</span>' + '<button name="button" data-ng-click="attemptQuiz()">' + 'OK' + '</button>' + '<button name="button2">' + 'Play Again' + '</button>' + '</form>' + '</div>' + '<div id="progressBar">' + '<div data-ng-repeat="quiz in quizzes"' + 'class="marker {{ quiz | toMarkerClass }}">' + '</div>' + '</div>' + '</div>'
        };
    });
})(Directives || (Directives = {}));
