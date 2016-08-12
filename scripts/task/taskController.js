(function () {
    'use strict';
    angular.module('app')
        .controller('taskController', ['taskService', '$q', '$mdDialog', TaskController]);
    
    function TaskController(taskService, $q, $mdDialog) {
        var self = this;
        
        self.selected = null;
        self.tasks = [];
        self.filter = filterTask;
        self.totalEffort = 0;

        
        // Load initial data
        getAllTasks();
        
        //----------------------
        // Internal functions 
        //----------------------
        
        function calculateTotalEffort(tasks) {
            var effort = 0;
            tasks.forEach(function addEffort(task) {
                effort += task.effort;
            })
            return effort;
        }
        
        function getAllTasks() {
            taskService.getTasks().then(function (tasks) {
                self.tasks = [].concat(tasks);
                self.selected = tasks[0];
                self.totalEffort = calculateTotalEffort(tasks);
            });
        }
        function filterTask() {
            if (self.filterText == null || self.filterText == "") {
                getAllTasks();
            }
            else {
                taskService.getByBacklog(self.filterText).then(function (tasks) {
                    self.tasks = [].concat(tasks);
                    self.selected = tasks[0];
                });
            }
        }
    }

})();