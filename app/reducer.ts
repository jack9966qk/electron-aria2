import { Reducer } from 'redux'
import { Task, updateTaskList } from './model/task'
import { Options } from './model/options'

import {
    RootAction,
    CONNECTED,
    RECEIVED_TASKS_AND_STATUS,
    RECEIVED_OPTIONS,
    DISCONNECTED,
    NEW_NOTIFICATION
} from './actions'
import { GlobalStat } from './model/globalStat'

export type Server = {
    readonly hostUrl: string
    readonly secret: string
    readonly version: string
    readonly tasks: Map<string, Task>
    readonly options: Options
    readonly stat: GlobalStat
}

export type Notification = {
    readonly message: string
    readonly type: "success" | "error" | "warning" | "info"
}

export type RootState = {
    readonly server: Server | null
    readonly latestNotification: Notification | null
}

export const initialState: RootState = {
    server: null,
    latestNotification: null
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
        case RECEIVED_TASKS_AND_STATUS:
            const tasks = updateTaskList(state.server.tasks, action.payload.tasks)
            const { stat } = action.payload
            return {...state, server: {...state.server, tasks, stat}}
            break
        case RECEIVED_OPTIONS:
            return {...state, server: {...state.server, options: action.payload}}
            break
        case NEW_NOTIFICATION:
            return {...state, latestNotification: action.payload}
            break
        default:
            return state
            break
    }
}

export default reducer