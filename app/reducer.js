import { CONNECTED, RECEIVED_VERSION, ARBITRARY_VAL_CHANGED } from './actions'
const app = window.require('electron').remote.app
// console.log(window.require('electron'))
// const {app} = require('electron')

import AriaJsonRPC from '../model/rpc'

export const initialState = {
    hostUrl: "ws://localhost:6800/jsonrpc",
    token: "secret",
    rpc: undefined,
    version: undefined,
    // defaultDir: "/Users/Jack/Documents/GitHub/electron-aria2/testDownload",
    defaultDir: app.getPath("downloads") ,
    tasks: []
}

export default function reducer(state=initialState, action) {
    switch(action.type) {
        case CONNECTED:
            return {...state, rpc: action.rpc}
            break
        case RECEIVED_VERSION:
            return {...state, version: action.version}
            break
        case ARBITRARY_VAL_CHANGED:
            return {...state, [action.key]: action.value}
            break
        default:
            return state
            break
    }
}