import { IpcMainEvent } from "electron";
import { IpcRequest } from "../../shared/IpcRequest";

export interface IpcChannelInterface {
    channelName: string
    getName(): string;
    dispatch(event: IpcMainEvent, Wins: Object, request: IpcRequest): void;
}
