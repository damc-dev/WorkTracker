'use strict';

var request = require('request');
  
function onlyUnique(element, index, array) {
    return array.indexOf(element) === index;
}

class WorkSummaryService {
   constructor($q) {
       this.$q = $q;
   }
   getWorkSummary(startDate, endDate) {
            var deferred = this.$q.defer();
            var getWorkItemsPromise =  this.getWorkItems(startDate, endDate);
            console.log("getWorkItemsPromise", getWorkItemsPromise);
            getWorkItemsPromise.then(function(tasks) {
                var uniqueBacklogNames = tasks.map(function(task) {
                        return task.backlogName
                }).filter(onlyUnique);
                    console.log("uniqueBacklogNames:", uniqueBacklogNames);
                    var backlogs = uniqueBacklogNames.map(function(backlogName) {
                        var effort = tasks.filter(function(task) {
                            return task.backlogName == backlogName;
                        }).map(function(task) {
                            return parseFloat(task.effort);
                        }).reduce(function(previous, current) {
                            return previous + current;
                        });
                        return {
                            name: backlogName,
                            effort: effort.toFixed(2)
                        };
                    });
                    console.log("Service.getWorkSummary(%s, %s) returning: ", startDate, endDate, backlogs);
                deferred.resolve(backlogs);
            });
            return deferred.promise
        }
    
    getWorkItems(startDate, endDate) {
            var dateFormat = 'YYYY-MM-DD';
            var deferred = this.$q.defer();
            var formattedStartDate = moment(startDate).format(dateFormat)
            var formattedEndDate = moment(endDate).format(dateFormat)
              
            var requestPayload = `
from: Actual
select:
  - Workitem.Name
  - Workitem.Parent.Name
  - Date
  - Member.Name
  - Scope.Name
  - Value
filter:
  - Date>='${formattedStartDate}';Date<'${formattedEndDate}'
  - Member.Name='David McElligott'`
    
            console.log("GetWorkItems Request:", requestPayload);
            request.post(
                { 
                    uri:'http://www.netcontrol.von.tla.uprr.com/VersionOne/query.v1', 
                    auth: {
                        'user': 'igen829',
                        'password': 'igen829',
                        'sendImmediately': true
                    },
                    body: requestPayload
                    
                }, function(error, response, body) {
                      if (!error && response.statusCode == 200) {
                          var jsonResponse = JSON.parse(body)
                            console.log(body)
                            console.log(jsonResponse[0])
                            var tasks = jsonResponse[0].map(function(task) {
                                return {
                                    backlogName: task['Workitem.Parent.Name'],
                                    taskName: task['Workitem.Name'],
                                    taskOid: task['_oid'],
                                    effort: task['Value'],
                                    date: task['Date'],
                                    owner: task['Member.Name'],
                                    project: task['Scope.Name']
                                    
                                }
                            });
                            console.log("WorkItems between %s - %s:", formattedStartDate, formattedEndDate, tasks);
                            deferred.resolve(tasks); 
                      } else {
                        console.log(error);
                      }
                });
            return deferred.promise;
        }
}
 angular.module('app')
        .service('workSummaryService', ['$q', WorkSummaryService]);