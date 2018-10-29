// actions used along with redux

import { action } from "typesafe-actions"

export const CONNECTED = "CONNECTED"
export const connected = () => action(CONNECTED)

export const DISCONNECTED = "DISCONNECTED"
export const disconnected = () => action(DISCONNECTED)

export const RECEIVED_VERSION = "RECEIVED_VERSION"
export const receivedVersion = (version: string) =>
    action(RECEIVED_VERSION, version)

export const ARBITRARY_VAL_CHANGED = "ARBITRARY_VAL_CHANGED"
export const arbitraryValChanged = (key: string, value: any) =>
    action(ARBITRARY_VAL_CHANGED, {key, value})

export const SET_ARIA_REMOTE = "SET_ARIA_REMOTE"
export const setAriaRemote = (hostUrl: string, secret: string) =>
    action(SET_ARIA_REMOTE, {hostUrl, secret})


export type RootAction =
    ReturnType<typeof connected> |
    ReturnType<typeof disconnected> |
    ReturnType<typeof receivedVersion> |
    ReturnType<typeof arbitraryValChanged> |
    ReturnType<typeof setAriaRemote>