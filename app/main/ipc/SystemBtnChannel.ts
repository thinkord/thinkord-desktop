import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, BrowserWindow, ipcMain } from "electron";
const browserWindow = require('../browser-window');
const { useCapture } = require('../../media-capturer/dragsnip/capture-main');

export class SystemBtnChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName
    }

    getName(): string {
        return this.channelName
    }
    handle(event: IpcMainEvent, Wins: Object, args: any): void {
        switch (this.getName()) {
            case 'savebutton':
                if (Wins["homeWin"] !== null)
                    Wins["homeWin"].webContents.send('savebutton');
                break;
            case 'hidesavebutton':
                if (Wins["homeWin"] !== null)
                    Wins["homeWin"].webContents.send('hidesavebutton');
                break;
            case 'click-home':
                Wins["homeWin"].maximize();
                Wins["homeWin"].focus();
                break;
            case 'open-text-win':
                if (Wins["textWin"] === null) Wins["textWin"] = browserWindow.createTextWindow(Wins["textWin"], Wins["controlbarWin"]);
                Wins["textWin"].focus();
                break
            case 'close-text-win':
                Wins["textWin"].close();
                Wins["textWin"] = null;
                break
            case 'save-text-win-value':
                Wins["homeWin"].webContents.send('save-text-win-value', args);
                Wins["textWin"].close();
                Wins["textWin"] = null;
                break
            case 'file-open-click':
                // // Load collection.html to home window. 
                Wins["homeWin"] = browserWindow.changeHomeToCollection(Wins["homeWin"]);

                if (Wins["controlbarWin"] === null) {
                    Wins["controlbarWin"] = browserWindow.createControlBarWindow(Wins["controlbarWin"]);
                    useCapture(Wins["homeWin"]);
                } else {
                    Wins["controlbarWin"].focus();
                    // Keep listening on event 'move'.
                    // If control bar window is moved, text window will be closed.
                    Wins["controlbarWin"].on('move', () => {
                        if (Wins["textWin"] !== null) {
                            Wins["textWin"].close();
                            Wins["textWin"] = null;
                        }
                    });
                }
                // Keep listening on channel 'init-collection'.
                ipcMain.on('init-collection', () => {
                    // If it receive message from that channel, it would send message to 
                    // control bar window with channel 'init-collection'.
                    Wins["homeWin"].webContents.send('init-collection', args);
                });
                break;
            case 'quit-click':
                console.log('fucking quit click')
                Wins["controlbarWin"].close();
                Wins["controlbarWin"] = null;
                if (Wins["textWin"] !== null) {
                    Wins["textWin"].close();
                    Wins["textWin"] = null;
                }
                break;
        }
    }
}