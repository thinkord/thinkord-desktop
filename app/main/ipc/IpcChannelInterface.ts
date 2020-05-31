import { IpcMainEvent, BrowserWindow } from "electron";
// import { IpcRequest } from "../../shared/IpcRequest";

export interface IpcChannelInterface {

    getName(): string;

    handle(event: IpcMainEvent, homeWin: BrowserWindow): void;
}

