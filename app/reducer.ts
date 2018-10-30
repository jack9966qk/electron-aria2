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
    readonly version: string
    readonly defaultDir: string
    readonly tasks: Task[]
}

export const initialState: RootState = {
    rpc: new AriaJsonRPC("ws://localhost:6800/jsonrpc", "secret"),
    version: undefined,
    defaultDir: Electron.remote.app.getPath("downloads"),
    tasks: []
}

const reducer: Reducer<RootState, RootAction> =
    (state=initialState, action) => {
    switch(action.type) {
        case CONNECTED:
            return {...state}
            break
        case DISCONNECTED:
            return {...state, rpc: undefined}
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
            const rpc = new AriaJsonRPC(hostUrl, secret)
            return {...state, hostUrl, rpc}
            break
        default:
            return state
            break
    }
}

export default reducer