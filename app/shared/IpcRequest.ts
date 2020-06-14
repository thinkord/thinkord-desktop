export interface IpcRequest {
    type: string;
    responseChannel?: string; 

    params?: string[];
}
