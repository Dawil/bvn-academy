function VideoController($scope) {
    var VIDEO_MODE = 'video';
    var FORM_MODE = 'form';
    $scope.videoURL = "http://www.youtube.com/v/9bZkp7q19f0&enablejsapi=1&playerapiid=ytPlayer&version=3";
    $scope.showVideo = true;
    $scope.switchMode = function () {
        $scope.showVideo = !$scope.showVideo;
    };
}
