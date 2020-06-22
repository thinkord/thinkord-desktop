import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, ipcMain } from "electron";
const browserWindow = require('../browser-window');
const { useCapture } = require('../../media-capturer/dragsnip/capture-main');

export class SystemBtnChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName;
    }

    getName(): string {
        return this.channelName;
    }

    dispatch(event: IpcMainEvent, wins: Object, args: any): void {
        switch (this.getName()) {
            case 'savebutton':
                if (wins["homeWin"] !== null)
                    wins["homeWin"].webContents.send('savebutton');
                break;
            case 'hidesavebutton':
                if (wins["homeWin"] !== null)
                    wins["homeWin"].webContents.send('hidesavebutton');
                break;
            case 'click-home':
                wins["homeWin"].maximize();
                wins["homeWin"].focus();
                break;
            case 'open-text-win':
                if (wins["textWin"] === null) wins["textWin"] = browserWindow.createTextWindow(wins["textWin"], wins["controlbarWin"]);
                wins["textWin"].focus();
                break;
            case 'close-text-win':
                wins["textWin"].close();
                wins["textWin"] = null;
                break;
            case 'save-text-win-value':
                wins["homeWin"].webContents.send('save-text-win-value', args);
                wins["textWin"].close();
                wins["textWin"] = null;
                break;
            case 'file-open-click':
                // // Load collection.html to home window. 
                wins["homeWin"] = browserWindow.changeHomeToCollection(wins["homeWin"]);

                if (wins["controlbarWin"] === null) {
                    wins["controlbarWin"] = browserWindow.createControlBarWindow(wins["controlbarWin"]);
                    useCapture(wins["homeWin"]);
                } else {
                    wins["controlbarWin"].focus();
                    // Keep listening on event 'move'.
                    // If control bar window is moved, text window will be closed.
                    wins["controlbarWin"].on('move', () => {
                        if (wins["textWin"] !== null) {
                            wins["textWin"].close();
                            wins["textWin"] = null;
                        }
                    });
                }
                // Keep listening on channel 'init-collection'.
                ipcMain.on('init-collection', () => {
                    // If it receive message from that channel, it would send message to 
                    // control bar window with channel 'init-collection'.
                    wins["homeWin"].webContents.send('init-collection', args);
                });
                break;
            case 'quit-click':
                wins["controlbarWin"].close();
                wins["controlbarWin"] = null;
                if (wins["textWin"] !== null) {
                    wins["textWin"].close();
                    wins["textWin"] = null;
                }
                break;
        }
    }
}