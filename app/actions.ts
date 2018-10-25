export const CONNECTED = "CONNECTED"
export function connected(rpc) {
    return {
        type: CONNECTED,
        rpc: rpc
    }
}

export const RECEIVED_VERSION = "RECEIVED_VERSION"
export function receivedVersion(version) {
    return {
        type: RECEIVED_VERSION,
        version: version
    }
}

export const ARBITRARY_VAL_CHANGED = "ARBITRARY_VAL_CHANGED"
export function arbitraryValChanged(key, value) {
    return {
        type: ARBITRARY_VAL_CHANGED,
        key: key,
        value: value
    }
}