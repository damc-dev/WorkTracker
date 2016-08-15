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
            vm.backlogs = [].concat(backlogs);
            console.log("vm.backlogs", vm.backlogs)
            vm.selected = backlogs[0];
            
            if (backlogs.length > 0 ) {
                vm.totalEffort = backlogs.map(function (backlog) {
                    return backlog.effort
                }).reduce(function (previous, current) {
                    return parseFloat(previous) + parseFloat(current);
                });
            } else {
                vm.totalEffort = 0;
            }
        });
    }
    
    getSummaryYesterday() {
        var vm = this;
        vm.startDate = addDays(new Date(), -1);
        vm.endDate = addDays(vm.startDate, 1);
        vm.getWorkSummary();
    }
    
    getSummaryToday() {
        var vm = this;
        vm.startDate = new Date()
        vm.endDate = addDays(vm.startDate, 1);
        vm.getWorkSummary();
    }
    
    helloWorld(){
        console.log("Hello World");
    }
}

angular.module('app')
    .controller('workSummaryController', ['workSummaryService', '$q', '$mdDialog', '$log', WorkSummaryController]);