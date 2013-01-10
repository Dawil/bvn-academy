var Controllers;
(function (Controllers) {
    Controllers.VideoController = function ($scope, youtube) {
        $scope.selectedOption = {
            str: ''
        };
        $scope.quizMode = "attempting";
        $scope.$watch('youtubeId', function (newValue, oldValue) {
            youtube.load($scope.youtubeId, 'ytplayer').done(function () {
                youtube.getPlayer().playVideo();
                youtube.getPlayer().mute();
            });
        });
        $scope.quizzes.map(function (quiz) {
            youtube.atSecond(quiz.time, function () {
                $scope.quizMode = "attempting";
                $scope.selectedQuiz = quiz;
                $scope.showVideo = false;
                youtube.getPlayer().pauseVideo();
                $scope.$digest();
            });
        });
        $scope.attemptQuiz = function () {
            $scope.selectedQuiz.attempt = $scope.selectedOption.str === $scope.selectedQuiz.correctOption;
            if($scope.selectedQuiz.attempt) {
                $scope.quizMode = "correct";
            } else {
                $scope.quizMode = "incorrect";
            }
        };
        $scope.resume = function () {
            $scope.showVideo = true;
            youtube.getPlayer().playVideo();
        };
        $scope.retry = function () {
            $scope.quizMode = "attempting";
        };
        $scope.replay = function () {
            $scope.showVideo = true;
            var time = 0;
            youtube.getPlayer().seekTo(time);
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
