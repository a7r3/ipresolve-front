const path = require('path');
const url = require('url');
const fs = require('fs');

const electron = require('electron');
const { app, BrowserWindow } = electron;

// ipcMain to communicate between main and renderer process
const { ipcMain } = electron;
let win;

// create the browser window option
let bwOption = {
  width: 300,
  minWidth: 300,
  height: 450,
  minHeight: 450,
  autoHideMenuBar: true,
  webPreferences: {
    nodeIntegration: true
  }
};

function createWindow() {
  win = new BrowserWindow(bwOption);

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'html/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.on('close', (event) => {
    win = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null)
    createWindow();
});

ipcMain.on('login-user', (event, val) => {
  console.log(val);
  event.sender.send('login-callback', { status: 'success' });
});

ipcMain.on('closing-login-window', (event) => {

});

// const exec = require('child_process').exec;

// const yourscript = exec('sh start.sh',
//   (error, stdout, stderr) => {
//     console.log(stdout);
//     console.log(stderr);
//     if (error !== null) {
//       console.log(`exec error: ${error}`);
//     }
//   });
