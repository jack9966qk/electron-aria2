import { CONNECTED, RECEIVED_VERSION, ARBITRARY_VAL_CHANGED } from './actions'
import * as Electron from 'electron'
import AriaJsonRPC from './model/rpc'
import { Token } from './model/rpc'
import { Reducer } from 'redux'
import { RootAction } from './actions'

export type RootState = {
    readonly hostUrl: string
    readonly token: Token
    readonly rpc: AriaJsonRPC
    readonly version: string
    readonly defaultDir: string
    readonly tasks: object[]
}

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