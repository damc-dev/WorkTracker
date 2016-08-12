(function () {
    'use strict';
    var request = require('request');
    
    angular.module('app')
        .service('taskService', ['$q', TaskService]);
    
    function TaskService($q) {
        
        return {
            getTasks: getTasks,
        };
       
        function getTasks() {
            var deferred = $q.defer();
            request.post(
                { 
                    uri:'http://www.netcontrol.von.tla.uprr.com/VersionOne/query.v1', 
                    auth: {
                        'user': 'igen829',
                        'password': 'igen829',
                        'sendImmediately': true
                    },
                    body: `
from: Actual
select:
  - Workitem.Name
  - Workitem.Parent.Name
  - Date
  - Member.Name
  - Scope.Name
  - Value
filter:
  - Date>='2016-08-10';Date<'2016-08-11'
  - Member.Name='David McElligott'
                    `
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
                            console.log(tasks);
                            deferred.resolve(tasks); 
                      } else {
                        console.log(error);

                      }
                });
            return deferred.promise;
        }
        
        function getByBacklog(searchBacklogName) {
            
            var deferred = $q.defer();
            setTimeout(function() {
                
                deferred.resolve(tasks.filter(function likeBacklogName(task) {
                    return task.backlogName.indexOf(searchBacklogName) != -1
                }))
            }, 1000);
          
            return deferred.promise;
        }
    }
})();