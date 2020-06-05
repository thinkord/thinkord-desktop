import { IpcMainEvent } from "electron";
// import { IpcRequest } from "../../shared/IpcRequest";

export interface IpcChannelInterface {
    channelName: string
    getName(): string;
    handle(event: IpcMainEvent, Wins: Object, args: any): void;
}
