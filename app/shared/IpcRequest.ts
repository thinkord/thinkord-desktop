import { string } from "prop-types";

export type params={
    action?: string
}
export interface IpcRequest {
    type?: string;
    responseChannel?: string; 
    params?: params
}

// export class IpcRequest implements IIpcRequest {
//     type: string;
//     responseChannel?: string;
//     params?: string[];

//     constructor(options:object) {
//         this.type = options.type;
//     }
// }
