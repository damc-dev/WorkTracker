var gulp        = require('gulp'), 
  childProcess  = require('child_process'), 
  electron      = require('electron-prebuilt');

// create the gulp task
gulp.task('start', function () { 
  return childProcess.spawn(electron, ['--debug=5858', '.'], { stdio: 'inherit' }); 
});