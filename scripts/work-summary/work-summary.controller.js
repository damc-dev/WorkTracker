'use strict';

function addDays(date, extraDays) {
    var futureDate = new Date();
    futureDate.setDate(date.getDate() + extraDays);
    return futureDate;
}

class WorkSummaryController {
    constructor(workSummaryService, $q, $mdDialog, $log) {
        this.workSummaryService = workSummaryService;
        var self = this;
        this.selected = null;
        self.backlogs = [];
        self.totalEffort = 0;
        self.startDate = new Date('2016-08-11')
        self.endDate = addDays(self.startDate, 1);
        
        // Load initial data
        this.getWorkSummary();

    }
    
    
    getWorkSummary() {
        this.workSummaryService.getWorkSummary(self.startDate, self.endDate).then(function (backlogs) {
            console.log(backlogs);
            self.backlogs = [].concat(backlogs);
            self.selected = backlogs[0];
            
            if (backlogs.length > 0 ) {
                self.totalEffort = backlogs.map(function (backlog) {
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