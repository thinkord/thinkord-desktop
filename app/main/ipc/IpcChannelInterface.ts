import { IpcMain, IpcMainEvent,BrowserWindow } from "electron";
import { IpcRequest } from "../../shared/IpcRequest";

export interface IpcChannelInterface {

    getName(): string;

    handle(event: IpcMainEvent, request: IpcRequest,homeWin:BrowserWindow): void;
}

