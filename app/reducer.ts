import { CONNECTED, RECEIVED_VERSION, ARBITRARY_VAL_CHANGED } from './actions'
// const app = window.require('electron').remote.app
import * as Electron from 'electron'
import AriaJsonRPC from './model/rpc'

// let app = Electron.remote.require("app")

export interface RootState {
    hostUrl: string
    token: string
    rpc: any
    version: any
    defaultDir: string
    tasks: object[]
}

export const initialState: RootState = {
    hostUrl: "ws://localhost:6800/jsonrpc",
    token: "secret",
    rpc: undefined,
    version: undefined,
    defaultDir: "/Users/Jack/Downloads",
    // defaultDir: app.getPath("downloads") ,
    tasks: []
}

export default function reducer(state: RootState=initialState, action) {
    switch(action.type) {
        case CONNECTED:
            return {...state, rpc: action.rpc}
            break
        case RECEIVED_VERSION:
            return {...state, version: action.version}
            break
        case ARBITRARY_VAL_CHANGED:
            return {...state, [action.key]: action.value}
            break
        default:
            return state
            break
    }
}