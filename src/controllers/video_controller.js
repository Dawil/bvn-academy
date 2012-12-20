var VideoController = function ($scope, youtube) {
    var VIDEO_MODE = 'video';
    var FORM_MODE = 'form';
    $scope.videoURL = "9bZkp7q19f0";
    youtube.load($scope.videoURL, 'ytplayer').then(function (a) {
        youtube.getPlayer().playVideo();
        youtube.getPlayer().mute();
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
