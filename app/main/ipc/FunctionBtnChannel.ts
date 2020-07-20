import { IpcChannelInterface } from "./IpcChannelInterface";
import { IpcMainEvent } from "electron";
import { IpcRequest } from "../../shared/IpcRequest";
import { operateFuncButton } from "../controllers/operation";

export class FunctionBtnChannel implements IpcChannelInterface {
    channelName: string
    constructor(channelName: string) {
        this.channelName = channelName;
    }

    getName(): string {
        return this.channelName;
    }

    dispatch(event: IpcMainEvent, wins: object, request: IpcRequest): void {
        switch (request.type) {
            case 'POST':
                operateFuncButton(wins, request.params)
                break;
        }
    }
}