import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as Electron from "electron"

import Control, { DispatchProps, StoreProps } from "../views/control"
import {
    connected,
    disconnected,
    receivedTasks,
    RootAction
} from "../actions"
import AriaJsonRPC from '../model/rpc'
import { RootState } from "../reducer"

const mainFuncs = Electron.remote.require("./mainFuncs.js")

function mapStateToProps(state: RootState): StoreProps {
    return {
        server: state.server
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

    const onConnectionSuccess = (rpc: AriaJsonRPC) => {
        console.log("onSuccess")
        Promise.all([
            rpc.call("aria2.getVersion", []),
            rpc.call("aria2.getGlobalOption", []),
            rpc.getAllTasks()
        ]).then( ([version, options, tasks]) => {
            dispatch(connected({
                hostUrl: rpc.url,
                secret: rpc.secret,
                version, options, tasks
            }))
            // get new task status every 500ms
            refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
        })
    }

    const onConnectionClose = (rpc: AriaJsonRPC) => () => {
        dispatch(disconnected(rpc.url))
    }

    const eventHandlers = {
        "aria2.onDownloadStart": refreshTasks,
        "aria2.onDownloadPause": refreshTasks,
        "aria2.onDownloadStop": refreshTasks,
        "aria2.onDownloadComplete": refreshTasks,
        "aria2.onDownloadError": refreshTasks,
        "aria2.onBtDownloadComplete": refreshTasks
    }

    const connect = (url, secret, onRes, onNotif, onErr, onConnErr, onConnSuccess) => {
        const rpc = new AriaJsonRPC(url, secret, onRes, onErr)
        // register handlers for notifications
        for (const event in eventHandlers) {
            const func = eventHandlers[event]
            rpc.on(event, (message) => {
                func(rpc)
                onNotif(event, message)
            })
        }
        const onSuccess = () => {
            onConnSuccess(rpc)
            onConnectionSuccess(rpc)
        }
        rpc.connect(
            onSuccess,
            onConnectionClose(rpc),
            onConnErr)
    }

    return {
        connectLocal: (onRes, onNotif, onErr, onConnErr, onConnSuccess) => {
            const {hostUrl, secret} = mainFuncs
            const launchAndRetry = () => {
                mainFuncs.launchAria()
                // it seems to be necessary to wait a little
                // for aria2c server to fully start
                setTimeout(() => {
                    connect(hostUrl, secret, onRes, onNotif, onErr, onConnErr, onConnSuccess)
                }, 200);
            }
            connect(hostUrl, secret, onRes, onNotif, onErr, launchAndRetry, onConnSuccess)
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