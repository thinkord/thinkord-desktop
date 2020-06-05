import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from "electron";
// import { IpcRequest } from "../../shared/IpcRequest";

export class CollectionChannel implements IpcChannelInterface {
    channelName: string
    constructor(channelName: string) {
        this.channelName = channelName;
    }

    getName(): string {
        return this.channelName;
    }

    handle(event: IpcMainEvent, wins: Object, args: any): void {
        switch (this.getName()) {
            case 'save-collection':
                event.reply('save-collection');
                break;
            case 'init-collection-title':
                if (wins["homeWin"] !== null) wins["homeWin"].webContents.send('init-collection-title', args);
                break;
            case 'update-collections':
                break;
            case 'rename-collection':
                break;
            case 'delete-collection':
                break;
        }
    }
}