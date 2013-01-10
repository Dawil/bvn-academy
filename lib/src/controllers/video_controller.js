var Controllers;
(function (Controllers) {
    Controllers.VideoController = function ($scope, youtube) {
        $scope.selectedOption = {
            str: ''
        };
        $scope.$watch('youtubeId', function (newValue, oldValue) {
            youtube.load($scope.youtubeId, 'ytplayer').done(function () {
                youtube.getPlayer().playVideo();
                youtube.getPlayer().mute();
            });
        });
        $scope.quizzes.map(function (quiz) {
            youtube.atSecond(quiz.time, function () {
                $scope.selectedQuiz = quiz;
                $scope.showVideo = false;
                youtube.getPlayer().pauseVideo();
                $scope.$digest();
            });
        });
        $scope.attemptQuiz = function () {
            $scope.selectedQuiz.attempt = $scope.selectedOption.str === $scope.selectedQuiz.correctOption;
            $scope.switchMode();
            youtube.getPlayer().playVideo();
        };
        $scope.showVideo = true;
        $scope.switchMode = function () {
            $scope.showVideo = !$scope.showVideo;
        };
    };
    Controllers.VideoController.$inject = [
        '$scope', 
        'youtube'
    ];
})(Controllers || (Controllers = {}));
