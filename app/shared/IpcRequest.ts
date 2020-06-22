export interface IpcRequest {
    type?: string;
    responseChannel?: string; 

    params?: string[];
}


// export class IpcRequest implements IIpcRequest {
//     type: string;
//     responseChannel?: string;
//     params?: string[];

//     constructor(options:object) {
//         this.type = options.type;
//     }
// }
