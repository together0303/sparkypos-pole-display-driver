const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const serialPort = require('./pole.display');

const store = require('./store');
const storePath = path.join(app.getPath('userData'), 'store.json');
store.setStorePath(storePath);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

require('./server');

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: "#ccc",
        icon: __dirname + '/pole_display.ico',
        webPreferences: {
            nodeIntegration: true, // to allow require
            contextIsolation: true, // allow use with Electron 12+
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    
    serialPort.init({
        upper: 'SHAWN\'S FLEA MARKET',
        lower: '     THANK YOU     ',
        main: mainWindow, 
        port: store.get('port')
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('clear', () => {
        serialPort.clear()
        mainWindow.webContents.send('display', {upper: '', lower: ''})
        return 'clear'
    })
    ipcMain.handle('reset', () => {
        serialPort.reset()
        return 'reset'
    })
    ipcMain.on('write', (event, data) => {
        serialPort.text(data.upper, data.lower);
        return 'write'
    })
    ipcMain.on('connect', (event, port) => {
        if (port) store.set('port', port);
        serialPort.reset(port);
        return 'write'
    })
    createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
