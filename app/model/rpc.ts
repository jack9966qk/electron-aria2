import * as JsonRPC from 'simple-jsonrpc-js'

export type MethodName = string
export type Token = string
type JsonRPC = any

enum Status {
    Disconnected,
    Connecting,
    Connected
}

export default class AriaJsonRPC {
    url: string
    token: Token
    jrpc: JsonRPC
    socket: WebSocket
    responseCallbacks: Set<Function>
    errorCallbacks: Set<Function>
    status: Status

    constructor(url: string, token: Token) {
        this.url = url
        this.token = token
        this.jrpc = undefined
        this.socket = undefined
        this.status = Status.Disconnected
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
    
    connect() {
        this.status = Status.Connecting
        const jrpc = new JsonRPC()
        return new Promise((res, rej) => {
            try {
                const socket = new WebSocket(this.url)
                jrpc.toStream = (_msg) => { socket.send(_msg) }
                socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
                socket.onclose = (event) => {
                    if (event.code !== 3001) {
                        // using async function with `throw event` below won't work
                        rej(event)
                    } else {
                        console.log("rpc connection closed normally")
                    }
                }
                // TODO: handle normal WS errors better
                socket.onerror = (event) => { console.log(event) }
                socket.onopen = () => {
                    this.jrpc = jrpc
                    this.socket = socket
                    this.status = Status.Connected
                    res()
                }
            } catch(e) {
                throw e
            }
        })
    }

    disconnect() {
        this.socket.close()
        this.socket = null
        this.jrpc = null
        this.status = Status.Disconnected
    }

    async call(method: MethodName, args: any[], silent=false): Promise<any> {
        const callAll = (funcs: Set<Function>, args: any[]) => {
            if (!silent) {
                for (let f of funcs) {
                    f(...args)
                }
            }
        }

        try {
            const result = await this.jrpc.call(method, [`token:${this.token}`].concat(args))
            callAll(this.responseCallbacks, [method, args, result])
            return result
        } catch(error) {
            callAll(this.errorCallbacks, [method, args, error])
            throw error
        }
    }
    
    async getAllTasks() {
        const values = await Promise.all([
            this.call("aria2.tellActive", [], true),
            this.call("aria2.tellWaiting", [0, 100], true),
            this.call("aria2.tellStopped", [0, 100], true)
        ])
        const tasks = (values as any).reduce((a, b) => a.concat(b))
        return tasks
    }
}