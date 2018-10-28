import { Reducer } from 'redux'
import * as Electron from 'electron'

import { CONNECTED, RECEIVED_VERSION, ARBITRARY_VAL_CHANGED, SET_ARIA_REMOTE, DISCONNECTED } from './actions'
import AriaJsonRPC from './model/rpc'
import { Token } from './model/rpc'
import { RootAction } from './actions'

export type RootState = {
    readonly hostUrl: string
    readonly token: Token
    readonly rpc: AriaJsonRPC
    readonly version: string
    readonly defaultDir: string
    readonly tasks: object[]
}

// export const initialState: RootState = {
//     hostUrl: undefined,
//     token: undefined,
//     rpc: undefined,
//     version: undefined,
//     defaultDir: Electron.remote.app.getPath("downloads"),
//     tasks: []
// }


// for testing purpose only
export const initialState: RootState = {
    hostUrl: "ws://localhost:6800/jsonrpc",
    token: "secret",
    rpc: undefined,
    version: undefined,
    defaultDir: Electron.remote.app.getPath("downloads"),
    tasks: []
}

const reducer: Reducer<RootState, RootAction> =
    (state=initialState, action) => {
    switch(action.type) {
        case CONNECTED:
            return {...state, rpc: action.payload}
            break
        case DISCONNECTED:
            return {...state, rpc: undefined}
        case RECEIVED_VERSION:
            return {...state, version: action.payload}
            break
        case ARBITRARY_VAL_CHANGED:
            const {key, value} = action.payload
            return {...state, [key]: value}
            break
        case SET_ARIA_REMOTE:
            const {hostUrl, secret} = action.payload
            return {...state, hostUrl, token: secret}
        default:
            return state
            break
    }
}

export default reducer