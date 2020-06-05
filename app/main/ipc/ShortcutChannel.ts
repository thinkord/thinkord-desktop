import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, globalShortcut } from "electron";
// import { IpcRequest } from "../../shared/IpcRequest";

export class ShortcutChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName;
    }

    getName(): string {
        return this.channelName;
    }

    handle(event: IpcMainEvent, wins: Object, args: any): void {
        switch (this.getName()) {
            case 'register-shortcuts':
                globalShortcut.register('Shift+F1', () => {
                    // Send message to home window with channel 'full-snip'
                    wins["homeWin"].webContents.send('full-snip');
                });

                globalShortcut.register('Shift+F2', () => {
                    // Send message to home window with channel 'open-text-win'
                    wins["homeWin"].webContents.send('open-text-win');
                });

                globalShortcut.register('Shift+F3', () => {
                    // Send message to home window with channel 'drag-snip'
                    wins["homeWin"].webContents.send('drag-snip');
                });

                globalShortcut.register('Shift+F4', () => {
                    // Send message to home window with channel 'record-audio'
                    wins["homeWin"].webContents.send('record-audio');
                });

                globalShortcut.register('Shift+F5', () => {
                    // Send message to home window with channel 'record-video'
                    wins["homeWin"].webContents.send('record-video');
                });
                break;
            case 'unregister-shortcuts':
                globalShortcut.unregisterAll();

                // Let user always send message to control bar window with channel 'Ctrl+Shift+s'.
                globalShortcut.register('Ctrl+Shift+s', () => {
                    wins["controlbarWin"].webContents.send('Ctrl+Shift+s');
                });
                break;
        }
    }
}