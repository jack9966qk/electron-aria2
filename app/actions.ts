// actions used along with redux

import AriaJsonRPC from "./model/rpc"
import { action } from "typesafe-actions"

export const CONNECTED = "CONNECTED"
export const connected = (rpc: AriaJsonRPC) =>
    action(CONNECTED, rpc)


export const RECEIVED_VERSION = "RECEIVED_VERSION"
export const receivedVersion = (version: string) =>
    action(RECEIVED_VERSION, version)

export const ARBITRARY_VAL_CHANGED = "ARBITRARY_VAL_CHANGED"
export const arbitraryValChanged = (key: string, value: any) =>
    action(ARBITRARY_VAL_CHANGED, {key, value})


export type RootAction =
    ReturnType<typeof connected> |
    ReturnType<typeof receivedVersion> |
    ReturnType<typeof arbitraryValChanged>