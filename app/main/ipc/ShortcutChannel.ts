import { IpcMainEvent } from "electron";
import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcRequest } from "../../shared/IpcRequest";
import { registerShortcut, unregisterShortcut } from '../controllers/shortcut';

export class ShortcutChannel implements IpcChannelInterface {
    channelName: string

    constructor(channelName: string) {
        this.channelName = channelName;
    }

    getName(): string {
        return this.channelName;
    }

    dispatch(event: IpcMainEvent, wins: Object, request: IpcRequest): void {
        switch (request.type) {
            case 'POST':
                registerShortcut(wins);
                break;
            case 'DELETE':
                unregisterShortcut(wins);
                break;
        }
    }
}
