// actions used along with redux

import { action } from "typesafe-actions"
import { Task } from "./model/task"
import { Options } from "./model/options"
import { Server, Notification } from "./reducer"
import { GlobalStat } from "./model/globalStat";

export const CONNECTED = "CONNECTED"
export const connected = (server: Server) => action(CONNECTED, server)

export const DISCONNECTED = "DISCONNECTED"
export const disconnected = (hostUrl: string) => action(DISCONNECTED, hostUrl)

export const RECEIVED_TASKS_AND_STATUS = "RECEIVED_TASKS_AND_STATUS"
export const receivedTasksAndStatus = (tasks: Map<string, Task>, stat: GlobalStat) =>
    action(RECEIVED_TASKS_AND_STATUS, {tasks, stat})

export const RECEIVED_OPTIONS = "RECEIVED_OPTIONS"
export const receivedOptions = (options: Options) =>
    action(RECEIVED_OPTIONS, options)

export const NEW_NOTIFICATION = "NEW_NOTIFICATION"
export const newNotification = (notification: Notification) =>
    action(NEW_NOTIFICATION, notification)

export type RootAction =
    ReturnType<typeof connected> |
    ReturnType<typeof disconnected> |
    ReturnType<typeof receivedTasksAndStatus> |
    ReturnType<typeof receivedOptions> |
    ReturnType<typeof newNotification>