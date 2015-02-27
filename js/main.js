/**
 *
 * Created by Stephen Wille
 * Date: 8/31/13
 */


"use strict";




/* modules and shims */
require.config({
    paths:{
        angular:'angular'
        ,jquery:"jquery.2"
   }
   ,shim: {
        chartsjs:{
            exports:'chart'
        },
        routes:{
            exports:'angular-routes'
            ,deps:['angular']
        }
        ,app:{
            exports:'app'
            ,deps:['angular']
        }
    }
});



//the "main" function to bootstrap the app
require(['jquery', 'app', 'chart']
    ,function ($)
    {
        var wkr = new Worker('js/worker.getAndMergeUsersWithLogs.js'),
            pageWrap = document.getElementById('pageWrap'),
            hasBeenBoostraped,
            appScope,
            injector,
            userFactory,
            userData = [],
            idx = 0;

        wkr.onmessage = function(e)
        {
            hasBeenBoostraped = pageWrap.getAttribute('ng-app');
            if(hasBeenBoostraped === null)
            {/* we have one user, boot app */
                pageWrap.setAttribute('ng-app', 'app');
                pageWrap.setAttribute('ng-controller', 'BodyCtrl');
                pageWrap.style.display = 'block';
                document.getElementById('intro').style.display = 'none';
                angular.bootstrap(document, ['app']);
                userFactory = getUsersFactory();
                userFactory.addUser(e.data);
            }
            else
            {
                userFactory = getUsersFactory();
                userFactory.addUser(e.data);

//                wkr.terminate();
            }

            function getUsersFactory() {
                return angular.element(document.querySelector('[ng-controller="BodyCtrl"]'))
                        .injector().get('users');
            }
        } /* end wkr.onmessage */



        $(window).resize(function () {
            resizeChart();
        });

        $('document').ready(function() {
            resizeChart();
        })

        console.log('RequireJS dependencies loaded');

    });
















