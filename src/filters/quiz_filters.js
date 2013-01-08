academyModule.filter('toMarkerClass', function () {
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
}).filter('toIcon', function () {
    return function (input) {
        if(input.attempt) {
            return '✔';
        } else {
            if(input.attempt == false) {
                return '✘';
            } else {
                if(input.attempt == null) {
                    return '•';
                } else {
                    return '';
                }
            }
        }
    }
});
