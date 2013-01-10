overlayModule.filter('toMarkerClass', function () {
    return function (input) {
        if(input.attempt) {
            return 'completed-quiz';
        } else {
            if(input.attempt == false) {
                return 'failed-quiz';
            } else {
                if(input.attempt == null) {
                    return 'unattempted-quiz';
                } else {
                    return '';
                }
            }
        }
    }
});
