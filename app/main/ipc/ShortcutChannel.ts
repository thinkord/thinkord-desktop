import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, IpcMain, BrowserWindow, globalShortcut } from "electron";
import { IpcRequest } from "../../shared/IpcRequest";
import { execSync } from "child_process";



export class ShortcutChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName
    }
    getName(): string {
        return this.channelName
    }

    handle(event: IpcMainEvent, request: IpcRequest, homeWin: BrowserWindow): void {
        // if (request.responseChannel) {
        //     request.responseChannel = `${this.getName()}_response`;
        // }

        console.log("hello world bitch")


        globalShortcut.register('Shift+F1', () => {
            // Send message to home window with channel 'full-snip'
            homeWin.webContents.send('full-snip');
        });

        globalShortcut.register('Shift+F2', () => {
            // Send message to home window with channel 'open-text-win'
            homeWin.webContents.send('open-text-win');
        });

        globalShortcut.register('Shift+F3', () => {
            // Send message to home window with channel 'drag-snip'
            homeWin.webContents.send('drag-snip');
        });

        globalShortcut.register('Shift+F4', () => {
            // Send message to home window with channel 'record-audio'
            homeWin.webContents.send('record-audio');
        });

        globalShortcut.register('Shift+F5', () => {
            // Send message to home window with channel 'record-video'
            homeWin.webContents.send('record-video');
        });

       

    }
}