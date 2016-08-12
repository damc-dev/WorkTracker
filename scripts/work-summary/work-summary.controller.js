'use strict';

function addDays(date, extraDays) {
    var futureDate = new Date();
    futureDate.setDate(date.getDate() + extraDays);
    return futureDate;
}

class WorkSummaryController {
    constructor(workSummaryService, $q, $mdDialog, $log) {
        var vm = this;
        vm.workSummaryService = workSummaryService;
        vm.selected = null;
        vm.backlogs = [];
        vm.totalEffort = 0;
        vm.startDate = new Date()
        vm.endDate = addDays(vm.startDate, 1);
        
        // Load initial data
        vm.getWorkSummary();

    }
    
    
    getWorkSummary() {
        var vm = this;
        vm.workSummaryService.getWorkSummary(vm.startDate, vm.endDate).then(function (backlogs) {
            console.log(backlogs);
            vm.backlogs = [].concat(backlogs);
            console.log("Self.backlogs", vm.backlogs)
            vm.selected = backlogs[0];
            
            if (backlogs.length > 0 ) {
                vm.totalEffort = backlogs.map(function (backlog) {
                    return backlog.effort
                }).reduce(function (previous, current) {
                    return parseFloat(previous) + parseFloat(current);
                });
            }
        });
    }    
    
    helloWorld(){
        console.log("Hello World");
    }
}

angular.module('app')
    .controller('workSummaryController', ['workSummaryService', '$q', '$mdDialog', '$log', WorkSummaryController]);