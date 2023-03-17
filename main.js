const electron = require('electron');
const path = require('path');
let mainWindow;


const {app, BrowserWindow, Menu} = electron;
require('./app.js');



app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`http://34.133.10.230:3000/FBLA`);
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on('closed', event => {
        mainWindow = null;
    });
});

app.on("resize", function (e, x, y) {
    mainWindow.setSize(x, y);
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});

const mainMenuTemplate = [];