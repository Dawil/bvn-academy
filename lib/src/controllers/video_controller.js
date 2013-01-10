var Controllers;
(function (Controllers) {
    Controllers.VideoController = function ($scope, youtube) {
        $scope.$watch('youtubeId', function (newValue, oldValue) {
            youtube.load($scope.youtubeId, 'ytplayer').done(function () {
                youtube.getPlayer().playVideo();
                youtube.getPlayer().mute();
            });
        });
        $scope.showVideo = function () {
            return !youtube.hide;
        };
        $scope.quizzes.map(function (quiz) {
            youtube.atSecond(quiz.time, function () {
                $scope.selectedQuiz = quiz;
                youtube.hide = true;
                youtube.getPlayer().pauseVideo();
                $scope.$digest();
            });
        });
    };
    Controllers.VideoController.$inject = [
        '$scope', 
        'youtube'
    ];
})(Controllers || (Controllers = {}));
