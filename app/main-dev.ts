import { app, ipcMain, globalShortcut, dialog, BrowserWindow } from "electron";
import { IpcChannelInterface } from "./main/ipc/IpcChannelInterface";
import { ShortcutChannel } from "./main/ipc/ShortcutChannel";
import { FunctionBtnChannel } from "./main/ipc/FunctionBtnChannel";
import { SystemBtnChannel } from "./main/ipc/SystemBtnChannel";
const fs = require('fs');
const path = require('path');
const browserWindow = require('./main/browser-window');  // All functions related to browser window are defined here

// Third party module
require("regenerator-runtime/runtime");
const { useCapture } = require('./media-capturer/dragsnip/capture-main');
const { initUserEnv } = require('./utils/init-user-env');

let appSettingPath;  // Path to app.json, which stores every collection's location
let collectionDir;  // Path to collection directory, which stores collection's blocks and media path
let mediaDir;  // Path to media directory, which stores media files

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
        initUserEnv().then(res => {
            appSettingPath = res.appSettingPath;
            collectionDir = res.collectionDir;
            mediaDir = res.mediaDir;
        });

        app.on('ready', async () => {
            await this.createWindow()
            this.registerIpcChannels(ipcChannels)
        });
        app.on('window-all-closed', this.onWindowAllClosed);
        app.on('activate', async () => {
            await this.onActivate()
        });

        // Keep listening on channel 'save-collection'.
        // If it receive message from that channel, it would send message with the same channel
        // back to the original sender.
        ipcMain.on('save-collection', (event) => {
            event.reply('save-collection');
        });

        // Keep listening on channel 'init-collection-title'.
        // If it receive message from that channel, it would send message to home window
        // with channel 'init-collection-title'.
        ipcMain.on('init-collection-title', (event, args) => {
            if (this.wins["homeWin"] !== null) this.wins["homeWin"].webContents.send('init-collection-title', args);
        });


        // Keep listening on channel 'update-collections'.
        ipcMain.on('update-collections', (event) => {
            // Read data from path 'appSettingPath'
            fs.readFile(appSettingPath, (err, data) => {
                if (err) throw err;

                // Parse string to JS object.
                let json = JSON.parse(data);

                // Send JS object back to the original sender with channel 'update-collections'.
                event.reply('update-collections', json);
            });
        });

        // Keep listening on channel 'rename-collection'.
        ipcMain.on('rename-collection', (event, args) => {
            const newCollectionPath = path.join(collectionDir, args.newCollectionName + '.json');  // Collection path to be changed.
            const newCollectionName = args.newCollectionName;  // Collection name to be changed.
            let oldCollectionName = null;  // Original note name.

            // Rename collection in path 'appSettingPath'.
            fs.readFile(appSettingPath, (err, data) => {
                if (err) throw err;

                let json = JSON.parse(data);  // Parse string to JS object.

                // Loop through array.
                json["collections"].map((item, index) => {
                    // Search the object that is equal to the original one.
                    if (item["path"] === args.collectionPath) {
                        oldCollectionName = json["collections"][index].name;
                        json["collections"][index].path = newCollectionPath;  // Update collection path.
                        json["collections"][index].name = newCollectionName;  // Update collection name.
                    }
                });

                let jsonString = JSON.stringify(json);  // Convert Js object back to string.

                // Write the updated data to path 'appSettingPath'.
                fs.writeFile(appSettingPath, jsonString, (err) => {
                    if (err) throw err;

                    console.log(`Collection renamed`);
                });
            });

            // Rename collection's json name in directory 'Collection'
            fs.rename(args.collectionPath, newCollectionPath, (err) => {
                let msg = "";  // Message to be displayed on home window.

                // Send message back to the original sender with channel 'rename-collection'
                // if errors occur.
                if (err) {
                    msg = `There's something wrong with renaming file`;
                    event.reply('rename-collection', {
                        err: err,
                        msg: msg,
                        oldCollectionName: oldCollectionName,
                        CollectionIdx: args.collectionIdx
                    });
                }

                // Send message back to the original sender with channel 'rename-collection'
                // if collection renamed.
                msg = `${oldCollectionName} has been renamed to ${newCollectionName}`;
                event.reply('rename-collection', {
                    err: err,
                    msg: msg,
                    collectionIdx: args.collectionIdx,
                    collectionPath: args.collectionPath,
                    newCollectionPath: newCollectionPath,
                    newCollectionName: newCollectionName
                });
            });
        });

        // Keep listening on channel 'delete-collection'.
        ipcMain.on('delete-file', async (event, args) => {
            // Delete collection from app.json.
            fs.readFile(appSettingPath, (err, data) => {
                if (err) throw err;

                let json = JSON.parse(data);  // Parse string to JS object

                // Loop through array.
                json["collections"].map((item, index) => {
                    // Search the object that is equal to the original one.
                    if (item["path"] === args.collectionPath) {
                        json["collections"].splice(index, 1);  // Delete collection from array.
                    }
                });

                let jsonString = JSON.stringify(json);  // Convert JS object to string.

                // Write updated data to path 'appSettingPath'. 
                fs.writeFile(appSettingPath, jsonString, (err) => {
                    if (err) throw err;

                    console.log(`Collection deleted`);
                });
            });

            // Delete collection file in directory collection.
            fs.unlink(args.collectionPath, (err) => {
                let msg = "";  // Message to be displayed on home window.

                // Send message back to the original sender with channel 'delete-collection'
                // if errors occur.
                if (err) {
                    msg = `There's something wrong with deleting file`;
                    event.reply('delete-collection', {
                        err: err,
                        msg: msg,
                        collectionIdx: args.collectionIdx
                    });
                }

                // Send message back to the original sender with channel 'delete-collection'
                // if collection deleted.
                msg = `File has been deleted`;
                event.reply('delete-collection', {
                    err: err,
                    msg: msg,
                    collectionPath: args.collectionPath,
                    collectionIdx: args.collectionIdx
                });
            });
        });
    }

    private createWindow(): BrowserWindow {
        this.wins["homeWin"] = browserWindow.createHomeWindow(this.wins["homeWin"]);
        // this.wins["home"] = this.wins["homeWin"]
        console.log("fucking wins: ", this.wins)
        // tray = noteTray.enable(controlbarWin);  // Show Win10's tray at bottom right of your screen
        const { screen } = require('electron');
        const size = screen.getPrimaryDisplay().workAreaSize;
        browserWindow.setControlBarPosition(size);

        return this.wins["homeWin"]
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }
    private onActivate(): BrowserWindow {
        if (this.wins["homeWin"] === null) {
            this.wins["homeWin"] = browserWindow.createControlBarWindow();
            return this.wins["homeWin"]
        }
    }
    private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
        ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, args) => channel.handle(event, this.wins, args)))
    }
}

// The whole channels we register when initializing
(new Main()).init([
    new ShortcutChannel('register-shortcuts'),
    new ShortcutChannel('unregister-shortcuts'),
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
    new SystemBtnChannel('quit-click')
]);