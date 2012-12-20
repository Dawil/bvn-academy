var VideoController = function ($scope, youtube) {
    $scope.videoURL = "9bZkp7q19f0";
    youtube.load($scope.videoURL, 'ytplayer').then(function () {
        youtube.getPlayer().playVideo();
        youtube.getPlayer().mute();
    });
    youtube.onSecond(3, function () {
        $scope.showVideo = false;
        youtube.getPlayer().pauseVideo();
        $scope.$digest();
    });
    $scope.showVideo = true;
    $scope.switchMode = function () {
        $scope.showVideo = !$scope.showVideo;
    };
};
VideoController.$inject = [
    '$scope', 
    'youtube'
];
