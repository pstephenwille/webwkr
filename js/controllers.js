'use strict';

/* Controllers */

var myControllers = angular.module('app.controllers', []);



myControllers.controller('BodyCtrl', ['$scope', '$rootScope', 'users'
,function($scope, $rootScope, users)
{
    console.log('BodyCtrl');

    $scope.users = users.getUsers();

    $scope.$on('user:added', function(event, data){
        console.log('watch');
        console.log(event);
        console.log(data);
        $scope.users = users.getUsers();
        $scope.$digest();

    });


}]);







//myControllers.controller('SurveyCtrl2', ['$scope', '$location', 'pages',function controller2($scope, $location, pages)
//{
//    console.log('controller2()');
//
////    console.log(pages[0].questions);
//    $scope.questions = pages[0].questions;
//    $scope.back = '#/view1';
//    $scope.forward = '#/view3';
//}]);

