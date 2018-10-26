import { CONNECTED, RECEIVED_VERSION, ARBITRARY_VAL_CHANGED } from './actions'
// const app = window.require('electron').remote.app
import * as Electron from 'electron'
import AriaJsonRPC from './model/rpc'
import { Token } from './model/rpc'
import { DeepReadonly } from 'utility-types'
import { Reducer } from 'redux'
import { AriaAction } from './actions'

// let app = Electron.remote.require("app")

export type RootState = {
    hostUrl: string
    token: Token
    rpc: AriaJsonRPC
    version: string
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

const reducer: Reducer<RootState, AriaAction> =
    (state=initialState, action) => {
    switch(action.type) {
        case CONNECTED:
            return {...state, rpc: action.payload}
            break
        case RECEIVED_VERSION:
            return {...state, version: action.payload}
            break
        case ARBITRARY_VAL_CHANGED:
            const {key, value} = action.payload
            return {...state, [key]: value}
            break
        default:
            return state
            break
    }
}

export default reducer