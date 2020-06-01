import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent, BrowserWindow, globalShortcut } from "electron";
// import { IpcRequest } from "../../shared/IpcRequest";


export class FunctionBtnChannel implements IpcChannelInterface {
    channelName: string
    constructor(channelName: string) {
        this.channelName = channelName
    }
    getName(): string {
        return this.channelName
    }
    handle(event: IpcMainEvent, Wins:Object): void {
        switch (this.getName()) {
            case 'click-text-btn':
                Wins["homeWin"].webContents.send('open-text-win')
                break;
            case 'click-dragsnip-btn':
                Wins["homeWin"].webContents.send('drag-snip')
                break;
            case 'click-audio-btn':
                Wins["homeWin"].webContents.send('record-audio')
                break;
            case 'click-video-btn':
                Wins["homeWin"].webContents.send('record-video')
                break;
        }
    }
}