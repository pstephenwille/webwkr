'use strict';
// Declare app level module which depends on filters, and services
angular.module('app', [function ()
{
    console.log('app created');

}]);


/*todo handle pagination */



angular.module('app').factory('users', function ($rootScope)
{
    var users = [];
    console.log('user factory');

    function addUser(newUser)
    {
        users.push(newUser);
        $rootScope.$broadcast('user:added', newUser);
    }

    function getUsers()
    {
        return users;
    }

    return {
        getUsers:getUsers, addUser:addUser
    }
});
/* end factory 'users' */


angular.module('app').factory('chart', function ()
{
    console.log('chart factory');

    function create(user)
    {
        var canvasID = user.id, canvas, context, newChart, handle, counter = 0
            , startDate, endDate, label_str, datePattern
            , revenue = [], label = []
            , i, d;

        function getCanvas()
        {
            if (++counter > 10)
            { return clearInterval(handle); }

            canvas = document.getElementById(canvasID);
            if (canvas !== undefined)
            {/* canvas exists, build it out */
                var ctx = canvas.getContext('2d'), data, options;
                data = {
                    labels:label
                    ,datasets:[{
                        data:revenue,
                        fillColor:'rgba(0,0,0,0)',
                        strokeColor:'rgba(0,0,0,1)'}]
                };
                options = {
                    animation:false,
                    bezierCurve:false,
                    pointDot:false,
                    scaleGridLineColor:'rgba(0,0,0,0)',
                    scaleLineColor:'rgba(0,0,0,0)',
                    scaleShowGridLine:false,
                    scaleShowLabels:false
                };

                newChart = new Chart(ctx).Line(data, options);

                return clearInterval(handle)
                    , newChart;
            }
        }

        /*end getCanvas */
        handle = setInterval(getCanvas, 100);

        /* get data points */
        for (i = 0; i < user.conversions.length; i += 1)
            { revenue.push(user.conversions[i].revenue); }

        /* create start/end dates; 2013-04-05 */
        datePattern = /^\d{4}-(\d{2}-\d{2})/;

        startDate = user.conversions[0].time
            .match(datePattern)[1]
            .replace('-', '/');
        endDate = user.conversions.slice(-1)[0].time
            .match(datePattern)[1]
            .replace('-', '/');

        /* push start/end dates on to the label[] */
        label_str = 'Conversions ' + startDate + '-' + endDate;
        for (d = 0; d < label_str.length; d += 1)
            { label.push(label_str.charAt(d)); }
    }/* end create */


    return { create:create }

});
/* end factory 'chart' */

/*todo pass in chart factory, and call its create function with new user data, on braodcast */
angular.module('app').controller('BodyCtrl', ['$scope', '$rootScope', 'users', 'chart'
        , function ($scope, $rootScope, users, chart)
        {
            console.log('BodyCtrl');

            $scope.$on('user:added', function (event, data)
            {
                console.log('BodyCtrl user:added');
                $scope.users = users.getUsers();
                $scope.$digest();
            });
        }]
);


angular.module('app').controller('ChartCtrl', ['$scope', '$rootScope', 'users', 'chart'
        , function ($scope, $rootScope, users, chart)
        {
            console.log('chart controller');
            //        console.log($scope.user.id);


            $scope.chart = chart.create($scope.user);
        }]
);



angular.module('app').filter('avatarShowHide', function () {

    return function(url, tag)
    {
        var _class;
        switch (tag)
        {
            case 'p':
                _class = (url.indexOf('http') > -1)
                    ? 'avatarInitial hide'
                    : 'avatarInitial avatarBG0 show';
                break;

            case 'img':
                _class = (url.indexOf('http') > -1)
                    ? 'avatarImg show'
                    : 'avatarImg hide';
                break;

            default :  _class = 'no match';
                break;
        }

        return _class;
    };
});
angular.module('app').filter('firstInitial', function (){

    return function(name)
    {
        return name.charAt(0);
    };

});


