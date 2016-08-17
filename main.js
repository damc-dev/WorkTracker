var menubar = require('menubar')
require('electron-debug')({showDevTools: true});

var mb = menubar({
  height: 800,
  width: 800
})

mb.on('ready', function ready () {
  console.log('app is ready')
});

mb.on('after-create-window', function afterCreateWindow() {
});