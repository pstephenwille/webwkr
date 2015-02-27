/**
 *
 * Created by stephen
 * Date: 4/24/2014
 */


"use strict";

var users = 0, logs = 0, usersReq, logsReq;

logsReq = new XMLHttpRequest();
logsReq.open('GET', 'logs.json', true);
logsReq.setRequestHeader('Content-Type', 'application/json');
logsReq.onreadystatechange = function ()
{
    if (logsReq.readyState == 4)
    {
        if (logsReq.status == 200) {
            logs = JSON.parse(logsReq.responseText);
            mergeDataSets();
        }
    }
};
logsReq.send();


usersReq = new XMLHttpRequest();
usersReq.open('GET', 'users.json', true);
usersReq.setRequestHeader('Content-Type', 'application/json');
usersReq.onreadystatechange = function ()
{
    if (usersReq.readyState == 4)
    {
        if (usersReq.status == 200) {
            users = JSON.parse(usersReq.responseText);
            mergeDataSets();
        }
    }
};
usersReq.send();





function mergeDataSets() {
    var log, i, user, user_data = {};

    if (users !== 0 && logs !== 0)
    {
        /* create user obj to allow access by key */
        for (i = 0; (user = users[i++]);){
            user_data[user.id] = user;
            user.conversions = [];
            user.impressions = 0;
            user.revenue = 0;
        }

        /* through logs array */
        for (i = 0; (log = logs[i]); i++)
        {   /* get the user */
            if ((user = user_data[log.user_id])) {
                /* add the correct logs to user, and sum up revenue */
                if (log.type == 'conversion') user.conversions.push(log);
                if (log.type == 'impression') user.impressions += 1;
                user.revenue += log.revenue;
            }
        }

        /* data sources have been correlated, sort their logs and send to the page, one at a time. */
        for (i = 0; (user = users[i] && user_data[users[i++].id]);) {
            user.conversions = mergeSort(user.conversions);
            user.revenue = Math.floor(user.revenue);
            self.postMessage(user);
        }
    }
}



function mergeSort(userLogs)
{/* split array if not already sorted, and call merge() */
    if (userLogs.length < 2)
        return userLogs;

    var middle = parseInt(userLogs.length / 2);
    var left   = userLogs.slice(0, middle);
    var right  = userLogs.slice(middle, userLogs.length);

    return merge(mergeSort(left), mergeSort(right));
}
function merge(left, right)
{
    var result = [], lTime, rTime;
    while (left.length && right.length) {

        if (left[0].time <= right[0].time) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}

/* todo sort by last name */