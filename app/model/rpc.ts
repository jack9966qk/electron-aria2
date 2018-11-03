import * as JsonRPC from 'simple-jsonrpc-js'
import { Task } from './task'

export type MethodName = string
export type Token = string
type JsonRPC = any

export type NotificationResponse = { gid: string }

export default class AriaJsonRPC {
    url: string
    secret: Token
    jrpc: JsonRPC
    socket: WebSocket
    onAriaResponse: Function
    onAriaError: Function
    hasBeenOpen: boolean

    constructor(
        url: string,
        secret: Token,
        onAriaResponse: Function,
        onAriaError: Function
    ) {
        this.url = url
        this.secret = secret
        this.jrpc = new JsonRPC()
        this.socket = undefined
        this.onAriaResponse = onAriaResponse
        this.onAriaError = onAriaError
        this.hasBeenOpen = false
    }

    connect(
        onOpen: () => void,
        onClose: (boolean) => void,
        onConnErr: () => void
    ) {
        const socket = new WebSocket(this.url)
        this.jrpc.toStream = (_msg) => { socket.send(_msg) }
        socket.onmessage = (event) => {
            this.jrpc.messageHandler(event.data)
        }
        socket.onclose = (event) => {
            const isErr = event.code !== 3001
            if (!isErr) {
                onClose(false)
            } else if (this.hasBeenOpen) {
                onClose(true)
            } else {
                onConnErr()
            }
        }
        // TODO: handle normal WS errors better
        socket.onerror = (event) => { console.log(event) }
        socket.onopen = () => {
            this.socket = socket
            this.hasBeenOpen = true
            onOpen()
        }
    }

    disconnect() {
        this.socket.close()
        this.socket = null
        this.jrpc = null
    }

    on(event, callback: (response: NotificationResponse) => void) {
        this.jrpc.on(event, callback)
    }

    async call(method: MethodName, args: any[], silent=false): Promise<any> {
        const callback = (func: Function, args: any[]) => {
            if (!silent) { func(...args) }
        }

        try {
            const result = await this.jrpc.call(method, [`token:${this.secret}`].concat(args))
            callback(this.onAriaResponse, [method, args, result])
            return result
        } catch(error) {
            callback(this.onAriaError, [method, args, error])
            throw error
        }
    }
    
    async getAllTasks() {
        const values = await Promise.all([
            this.call("aria2.tellActive", [], true),
            this.call("aria2.tellWaiting", [0, 100], true),
            this.call("aria2.tellStopped", [0, 100], true)
        ])
        const flatten = (values as Task[][]).reduce((a, b) => a.concat(b))
        const tasks: Map<string, Task> = new Map()
        flatten.reduce(((map, task) => map.set(task.gid, task)), tasks)
        return tasks
    }
}