import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as Electron from "electron"

import Control, { DispatchProps, StoreProps } from "../views/control"
import {
    connected,
    disconnected,
    receivedVersion,
    receivedTasks,
    setAriaRemote,
    RootAction
} from "../actions"
import AriaJsonRPC from '../model/rpc'
import { RootState } from "../reducer"

const mainFuncs = Electron.remote.require("./mainFuncs.js")

function mapStateToProps(state: RootState): StoreProps {
    return {
        rpc: state.rpc,
        version: state.version,
        hostUrl: state.hostUrl,
        secret: state.secret
    }
}

let refreshLoopId: number

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const refreshTasks = (rpc: AriaJsonRPC) => {
        rpc.getAllTasks().then(tasks => {
            dispatch(receivedTasks(tasks))
        })
    }

    const onConnectionSuccess = (rpc: AriaJsonRPC) => () => {
        dispatch(connected(rpc))
        rpc.call("aria2.getVersion", []).then( ({version}) => {
            dispatch(receivedVersion(version))
            // get new task status every 500ms,
            // can be improved with JSONRPC notifications
            refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
        })
    }

    const onConnectionClose = (rpc: AriaJsonRPC) => () => {
        dispatch(disconnected(rpc))
    }

    return {
        connectOrLaunchLocal: (url, secret, onRes, onErr) => {
            const rpc = new AriaJsonRPC(url, secret, onRes, onErr)
            const onConnErr = () => {
                // launch local version and update rpc
                mainFuncs.launchAria()
                const {port, secret} = mainFuncs
                dispatch(setAriaRemote(`ws://localhost:${port}/jsonrpc`, secret))
            }
            rpc.connect(
                onConnectionSuccess(rpc),
                onConnectionClose(rpc),
                onConnErr)
        },
        connect: (url, secret, onRes, onErr, onConnErr) => {
            const rpc = new AriaJsonRPC(url, secret, onRes, onErr)
            rpc.connect(
                onConnectionSuccess(rpc),
                onConnectionClose(rpc),
                onConnErr)
        },
        disconnect: (rpc) => {
            clearInterval(refreshLoopId)
            // need a unified approach on how to and when to shut down
            // rpc.call("aria2.shutdown", [])
            rpc.disconnect()
        },
        purgeTasks: (rpc: AriaJsonRPC) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => {refreshTasks(rpc)})            
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Control)