import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as Electron from "electron"

import Control, { DispatchProps, StoreProps } from "../views/control"
import { connected, receivedVersion, receivedTasks, setAriaRemote, RootAction } from "../actions"
import AriaJsonRPC from '../model/rpc'
import { RootState } from "../reducer"

const mainFuncs = Electron.remote.require("./mainFuncs.js")

function mapStateToProps(state: RootState): StoreProps {
    return {
        rpc: state.rpc,
        version: state.version,
        hostUrl: state.rpc.url,
        token: state.rpc.token
    }
}

let refreshLoopId: number

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const refreshTasks = (rpc) => {
        rpc.getAllTasks().then(tasks => {
            dispatch(receivedTasks(tasks))
        })
    }

    const onConnectionSuccess = (rpc, onRes, onErr) => {
        dispatch(connected())
        rpc.addResponseCallback(onRes)
        rpc.addErrorCallback(onErr)
        rpc.call("aria2.getVersion", []).then( ({version}) => {
            dispatch(receivedVersion(version))
            // get new task status every 500ms,
            // can be improved with JSONRPC notifications
            refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
        })
    }

    return {
        connectOrLaunchLocal: (rpc: AriaJsonRPC, onRes, onErr) => {
            rpc.connect().then(() => {
                onConnectionSuccess(rpc, onRes, onErr)
            }).catch(() => {
                console.log("caught error")
                // launch local version and update rpc
                mainFuncs.launchAria()
                const {port, secret} = mainFuncs
                dispatch(setAriaRemote(`ws://localhost:${port}/jsonrpc`, secret))
            })
        },
        connect: (rpc: AriaJsonRPC, onRes, onErr, onConnErr) => {
            rpc.connect().then(() => {
                onConnectionSuccess(rpc, onRes, onErr)
            }).catch(() => {
                // connection failure
                onConnErr()
            })
        },
        disconnect: (rpc, _onRes, onErr) => {
            clearInterval(refreshLoopId)
            // need a unified approach on how to and when to shut down
            // rpc.call("aria2.shutdown", [])
            rpc.removeResponseCallback(onErr)
            rpc.removeErrorCallback(onErr)
            rpc.disconnect()
        },
        purgeTasks: (rpc) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => {refreshTasks(rpc)})            
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Control)