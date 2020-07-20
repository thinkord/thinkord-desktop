import { IpcRequest, params } from "../../shared/IpcRequest";

const operateFuncButton = (wins: object, params: params) => {
    wins["homeWin"].webContents.send(params.action);
}



export { operateFuncButton }