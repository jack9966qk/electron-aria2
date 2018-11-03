import { Reducer } from 'redux'
import * as Electron from 'electron'

import AriaJsonRPC from './model/rpc'
import { updateTaskList } from './model/task'

import {
    RootAction,
    CONNECTED,
    RECEIVED_VERSION,
    RECEIVED_TASKS,
    ARBITRARY_VAL_CHANGED,
    SET_ARIA_REMOTE,
    DISCONNECTED
} from './actions'
import { Task } from './model/task';

export type RootState = {
    readonly rpc: AriaJsonRPC
    readonly hostUrl: string
    readonly secret: string
    readonly version: string
    readonly defaultDir: string
    readonly tasks: Map<string, Task>
}

export const initialState: RootState = {
    rpc: undefined,
    hostUrl: "ws://localhost:6800/jsonrpc",
    secret: "secret",
    version: undefined,
    defaultDir: Electron.remote.app.getPath("downloads"),
    tasks: new Map()
}

const reducer: Reducer<RootState, RootAction> =
    (state=initialState, action) => {
    switch(action.type) {
        case CONNECTED:
            return {...state, rpc: action.payload}
            break
        case DISCONNECTED:
            // avoid removing active rpc
            const rpc = state.rpc === action.payload ? undefined : state.rpc
            return {...state, rpc}
        case RECEIVED_VERSION:
            return {...state, version: action.payload}
            break
        case RECEIVED_TASKS:
            const tasks = updateTaskList(state.tasks, action.payload)
            return {...state, tasks}
            break
        case ARBITRARY_VAL_CHANGED:
            const {key, value} = action.payload
            return {...state, [key]: value}
            break
        case SET_ARIA_REMOTE:
            const {hostUrl, secret} = action.payload
            return {...state, hostUrl, secret}
            break
        default:
            return state
            break
    }
}

export default reducer