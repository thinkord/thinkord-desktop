import { app, ipcMain, BrowserWindow } from "electron";
import { IpcChannelInterface } from "./main/ipc/IpcChannelInterface";
import { ShortcutChannel } from "./main/ipc/ShortcutChannel";
import { FunctionBtnChannel } from "./main/ipc/FunctionBtnChannel";
import { SystemBtnChannel } from "./main/ipc/SystemBtnChannel";
import { CollectionChannel } from "./main/ipc/CollectionChannel";
const browserWindow = require('./main/browser-window');  // All functions related to browser window are defined here

// Third party module
require("regenerator-runtime/runtime");
const { useCapture } = require('./media-capturer/dragsnip/capture-main');
const { initUserEnv } = require('./utils/init-user-env');

// // Make Win10 notification available
// app.setAppUserModelId(process.execPath);

require('dotenv').config();

class Main {
    wins: Object = {
        homeWin: null,
        controlbarWin: null,
        textWin: null
    }

    // homeWin: BrowserWindow
    public async init(ipcChannels: IpcChannelInterface[]) {
        app.on('ready', async () => {
            await this.createWindow();
            this.registerIpcChannels(ipcChannels);
        });
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', async () => await this.onActivate());
    }

    private createWindow(): BrowserWindow {
        this.wins["homeWin"] = browserWindow.createHomeWindow(this.wins["homeWin"]);
        // this.wins["home"] = this.wins["homeWin"]

        // tray = noteTray.enable(controlbarWin);  // Show Win10's tray at bottom right of your screen
        const { screen } = require('electron');
        const size = screen.getPrimaryDisplay().workAreaSize;
        browserWindow.setControlBarPosition(size);

        return this.wins["homeWin"];
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') app.quit();
    }

    private onActivate(): BrowserWindow {
        if (this.wins["homeWin"] === null) {
            this.wins["homeWin"] = browserWindow.createControlBarWindow();
            return this.wins["homeWin"];
        }
    }

    private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
        ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.dispatch(event, this.wins, request)));
    }
}

// The whole channels we register when initializing
(new Main()).init([
    new ShortcutChannel('shortcut'),
    new FunctionBtnChannel('click-text-btn'),
    new FunctionBtnChannel('click-dragsnip-btn'),
    new FunctionBtnChannel('click-audio-btn'),
    new FunctionBtnChannel('click-video-btn'),
    new SystemBtnChannel('savebutton'),
    new SystemBtnChannel('hidesavebutton'),
    new SystemBtnChannel('click-home'),
    new SystemBtnChannel('file-open-click'),
    new SystemBtnChannel('open-text-win'),
    new SystemBtnChannel('close-text-win'),
    new SystemBtnChannel('save-text-win-value'),
    new SystemBtnChannel('quit-click'),
    new CollectionChannel('save-collection'),
    new CollectionChannel('init-collection-title'),
    new CollectionChannel('update-collections'),
    new CollectionChannel('rename-collection'),
    new CollectionChannel('delete-collection')
]);
