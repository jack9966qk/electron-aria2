import * as JsonRPC from 'simple-jsonrpc-js'

export type MethodName = string
export type Token = string
type JsonRPC = any

export default class AriaJsonRPC {
    static connectToServer(url: string, token: string): Promise<AriaJsonRPC> {
        return new Promise((res, rej) => {
            const jrpc = new JsonRPC()
            try {
                const socket = new WebSocket(url)
                jrpc.toStream = (_msg) => { socket.send(_msg) }
                socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
                socket.onclose = (event) => {
                    if (event.code !== 3001) {
                        rej(event)
                    } else {
                        console.log("rpc connection closed normally")
                    }
                }
                // TODO: handle normal WS errors better
                socket.onerror = (event) => { console.log(event) }
                socket.onopen = () => {
                    res(new AriaJsonRPC(url, token, jrpc, socket))
                }
            } catch(e) {
                rej(e)
            }
        })
    }

    url: string
    token: Token
    jrpc: JsonRPC
    socket: WebSocket
    responseCallbacks: Set<Function>
    errorCallbacks: Set<Function>
    
    constructor(url: string, token: Token, jrpc: JsonRPC, socket: WebSocket) {
        this.url = url
        this.token = token
        this.jrpc = jrpc
        this.socket = socket
        this.responseCallbacks = new Set()
        this.errorCallbacks = new Set()
    }

    addResponseCallback(func: Function) {
        this.responseCallbacks.add(func)
    }

    removeResponseCallback(func: Function) {
        this.responseCallbacks.delete(func)
    }

    addErrorCallback(func: Function) {
        this.errorCallbacks.add(func)
    }

    removeErrorCallback(func: Function) {
        this.errorCallbacks.delete(func)
    }
    
    call(method: MethodName, args: any[], silent=false) {
        // console.log(method)
        // console.log([`token:${this.token}`].concat(args))
        const callback = (funcs: Set<Function>, args: any[]) => {
            if (!silent) {
                for (let f of funcs) {
                    f(...args)
                }
            }
        }

        return new Promise((res, rej) => {
            this.jrpc.call(method, [`token:${this.token}`].concat(args))
                .then(result => {
                    callback(this.responseCallbacks, [method, args, result])
                    res(result)
                }).catch(error => {
                    callback(this.errorCallbacks, [method, args, error])
                    rej(error)
                })
        })
    }
    
    getAllTasks(): Promise<object[]> {
        return Promise.all([
            this.call("aria2.tellActive", [], true),
            this.call("aria2.tellWaiting", [0, 100], true),
            this.call("aria2.tellStopped", [0, 100], true)
        ]).then( values => {
            const tasks = (values as any).reduce((a, b) => a.concat(b))
            // console.log(tasks)
            return tasks
        })
    }

    disconnect() {
        this.socket.close()
    }
}