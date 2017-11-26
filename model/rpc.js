import JsonRPC from 'simple-jsonrpc-js'

export default class AriaJsonRPC {
    static connectToServer(url, token) {
        const jrpc = new JsonRPC()
        const socket = new WebSocket(url)
        
        jrpc.toStream = (_msg) => { socket.send(_msg) }
        socket.onmessage = (event) => { jrpc.messageHandler(event.data) }
        socket.onclose = (event) => { console.log("connection closed") }
        return new Promise(res => {
            socket.onopen = () => {
                res(new AriaJsonRPC(url, token, jrpc, socket))
            }
        })
    }
    
    constructor(url, token, jrpc, socket) {
        this.url = url
        this.token = token
        this.jrpc = jrpc
        this.socket = socket
    }
    
    call(method, args) {
        console.log(method)
        console.log([`token:${this.token}`].concat(args))
        return this.jrpc.call(method, [`token:${this.token}`].concat(args))
    }
    
    getAllTasks() {
        return Promise.all([
            this.call("aria2.tellActive", []),
            this.call("aria2.tellWaiting", [0, 100]),
            this.call("aria2.tellStopped", [0, 100])
        ]).then( values => {
            const tasks = values.reduce((a, b) => a.concat(b))
            console.log(tasks)
            return tasks
        })
    }
}