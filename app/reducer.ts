import { Reducer } from 'redux'
import { updateTaskList } from './model/task'

import {
    RootAction,
    CONNECTED,
    RECEIVED_TASKS,
    DISCONNECTED
} from './actions'
import { Task } from './model/task'

export type Server = {
    readonly hostUrl: string
    readonly secret: string
    readonly version: string
    readonly options: any
    readonly tasks: Map<string, Task>
}

export type RootState = {
    readonly server: Server | null
}

export const initialState: RootState = {
    server: null
}

const reducer: Reducer<RootState, RootAction> =
    (state=initialState, action) => {
    switch(action.type) {
        case CONNECTED:
            return {...state, server: action.payload}
            break
        case DISCONNECTED:
            // remove if current server is what has been disconnected
            return state.server.hostUrl === action.payload ?
                {...state, server: null} : state
            break
        case RECEIVED_TASKS:
            const tasks = updateTaskList(state.server.tasks, action.payload)
            return {...state, server: {...state.server, tasks}}
            break
        default:
            return state
            break
    }
}

export default reducer