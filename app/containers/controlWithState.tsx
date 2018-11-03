import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as Electron from "electron"

import Control, { DispatchProps, StoreProps } from "../views/control"
import {
    connected,
    disconnected,
    receivedVersion,
    receivedTasks,
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
            // console.log(tasks)
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

    const connect = (url, secret, onRes, onErr, onConnErr) => {
        const rpc = new AriaJsonRPC(url, secret, onRes, onErr)
        rpc.connect(
            onConnectionSuccess(rpc),
            onConnectionClose(rpc),
            onConnErr)
    }

    return {
        connectLocal: (onRes, onErr, onConnErr) => {
            const {hostUrl, secret} = mainFuncs
            const launchAndRetry = () => {
                mainFuncs.launchAria()
                // it seems to be necessary to wait a little
                // for aria2c server to fully start
                setTimeout(() => {
                    connect(hostUrl, secret, onRes, onErr, onConnErr)
                }, 200);
            }
            connect(hostUrl, secret, onRes, onErr, launchAndRetry)
        },
        connect: connect,
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