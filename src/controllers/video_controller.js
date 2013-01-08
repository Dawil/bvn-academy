var Controllers;
(function (Controllers) {
    Controllers.VideoController = function ($scope, youtube) {
        $scope.videoURL = "9bZkp7q19f0";
        $scope.selectedOption = {
            str: ''
        };
        $scope.quizzes = [
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
        ];
        youtube.load($scope.videoURL, 'ytplayer').done(function () {
            youtube.getPlayer().playVideo();
            youtube.getPlayer().mute();
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
