const path = require('path');
const url = require('url');

const electron = require('electron');
const { app, BrowserWindow } = electron;

let win = null;

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
    pathname: path.join(__dirname, 'html/main.html'),
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

