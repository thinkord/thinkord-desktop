import { IpcRenderer } from 'electron';
import { IpcRequest } from "../shared/IpcRequest";

export class IpcClient {
    private ipcRenderer?: IpcRenderer;
 
    // , request: IpcRequest
    public send<T>(channel: string, request: IpcRequest): Promise<T> {
        // If the ipcRenderer is not available try to initialize it
        if (!this.ipcRenderer) {
            this.initializeIpcRenderer();
        }

        // If there's no responseChannel let's auto-generate it
        // if (!request.responseChannel) {
        //     request.responseChannel = `${channel}_response_${new Date().getTime()}`
        // }

        const ipcRenderer = this.ipcRenderer;
        ipcRenderer.send(channel, request);

        // This method returns a promise which will be resolved when the response has arrived.
        return new Promise(resolve => {
            ipcRenderer.once(request.type, (event, response) => resolve(response));
        });
    }

    private initializeIpcRenderer() {
        if (!window || !window.process || !window.require) {
            throw new Error(`Unable to require renderer process`);
        }
        this.ipcRenderer = window.require('electron').ipcRenderer;
    }
}
