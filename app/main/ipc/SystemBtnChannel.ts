import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, BrowserWindow, globalShortcut } from "electron";



export class SystemBtnChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName
    }

    getName(): string {
        return this.channelName
    }
    handle(event: IpcMainEvent,  Wins:Object): void {
        switch (this.getName()) {
            case 'savebutton':
                if (Wins["homeWin"] !== null)
                    Wins["homeWin"].webContents.send('savebutton');
                break;
            case 'hidesavebutton':
                if (Wins["homeWin"] !== null)
                    Wins["homeWin"].webContents.send('hidesavebutton');
                break;
        }
    }
}