var Controllers;
(function (Controllers) {
    Controllers.QuizController = function ($scope, youtube) {
        $scope.quizMode = "attempting";
        $scope.selectedOption = {
            str: ''
        };
        $scope.attemptQuiz = function () {
            $scope.selectedQuiz.attempt = $scope.selectedQuiz.correctOption === $scope.selectedOption.str;
            if($scope.selectedQuiz.attempt) {
                $scope.quizMode = "correct";
            } else {
                $scope.quizMode = "incorrect";
            }
        };
        $scope.resume = function () {
            $scope.quizMode = "attempting";
            youtube.hide = false;
            youtube.getPlayer().playVideo();
        };
        $scope.retry = function () {
            $scope.quizMode = "attempting";
        };
        $scope.replay = function () {
            youtube.hide = false;
            var time = 0;
            youtube.getPlayer().seekTo(time);
            youtube.getPlayer().playVideo();
        };
    };
    Controllers.QuizController.$inject = [
        "$scope", 
        "youtube"
    ];
})(Controllers || (Controllers = {}));
