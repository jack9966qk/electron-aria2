import * as JsonRPC from 'simple-jsonrpc-js'

export default class AriaJsonRPC {
    static connectToServer(url, token) {
        return new Promise((res, rej) => {
            const jrpc = new JsonRPC()
            try {
                const socket = new WebSocket(url)
                jrpc.toStream = (_msg) => { socket.send(_msg) }
                socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
                socket.onclose = (_event) => { console.log("connection closed") }
                socket.onopen = () => {
                    res(new AriaJsonRPC(url, token, jrpc, socket))
                }
            } catch(e) {
                rej(e)
            }
            
        })
    }

    url: string
    token: string
    jrpc: any
    socket: any
    responseCallbacks: Set<() => void>
    errorCallbacks: Set<() => void>
    
    constructor(url, token, jrpc, socket) {
        this.url = url
        this.token = token
        this.jrpc = jrpc
        this.socket = socket
        this.responseCallbacks = new Set()
        this.errorCallbacks = new Set()
    }

    addResponseCallback(func) {
        this.responseCallbacks.add(func)
    }

    removeResponseCallback(func) {
        this.responseCallbacks.delete(func)
    }

    addErrorCallback(func) {
        this.errorCallbacks.add(func)
    }

    removeErrorCallback(func) {
        this.errorCallbacks.delete(func)
    }
    
    call(method, args, silent=false) {
        // console.log(method)
        // console.log([`token:${this.token}`].concat(args))
        const callback = (funcs, args) => {
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
    
    getAllTasks() {
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
}