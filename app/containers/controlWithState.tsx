import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as Electron from "electron"

import Control, { DispatchProps, StoreProps } from "../views/control"
import { connected, receivedVersion, arbitraryValChanged, setAriaRemote, RootAction } from "../actions"
import AriaJsonRPC from '../model/rpc'
import { RootState } from "../reducer"

const mainFuncs = Electron.remote.require("./mainFuncs.js")

function mapStateToProps(state: RootState): StoreProps {
    return {
        rpc: state.rpc,
        version: state.version,
        hostUrl: state.hostUrl,
        token: state.token
    }
}

let refreshLoopId: number

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
    const refreshTasks = (rpc) => {
        rpc.getAllTasks().then(tasks => {
            dispatch(arbitraryValChanged("tasks", tasks))
        })
    }

    return {
        launchLocal: () => {
            if (mainFuncs.getAriaProc()) {
                console.log("local aria is already running")
            } else {
                console.log("launch aria from application")
                mainFuncs.launchAria()
            }
            const {port, secret} = mainFuncs
            dispatch(setAriaRemote(`ws://localhost:${port}/jsonrpc`, secret))
        },
        connect: (url, token, onRes, onErr) => {
            let rpc
            return AriaJsonRPC.connectToServer(url, token).catch(e => {
                onErr("Connection", "", e)
            }).then(jrpc => {
                dispatch(connected(jrpc as AriaJsonRPC))
                rpc = jrpc
                rpc.addResponseCallback(onRes)
                rpc.addErrorCallback(onErr)
                return rpc.call("aria2.getVersion", [])
            }).then( ({version}) => {
                dispatch(receivedVersion(version))
                // get new task status every 500ms,
                // can be improved with JSONRPC notifications
                refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
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