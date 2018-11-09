// actions used along with redux

import { action } from "typesafe-actions"
import { Task } from "./model/task"
import { Server } from "./reducer"

export const CONNECTED = "CONNECTED"
export const connected = (server: Server) => action(CONNECTED, server)

export const DISCONNECTED = "DISCONNECTED"
export const disconnected = (hostUrl: string) => action(DISCONNECTED, hostUrl)

export const RECEIVED_TASKS = "RECEIVED_TASKS"
export const receivedTasks = (tasks: Map<string, Task>) =>
    action(RECEIVED_TASKS, tasks)

export type RootAction =
    ReturnType<typeof connected> |
    ReturnType<typeof disconnected> |
    ReturnType<typeof receivedTasks>