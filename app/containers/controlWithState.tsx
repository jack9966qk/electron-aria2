import { connect } from "react-redux"
import { Dispatch } from "redux"

import Control, { DispatchProps, StoreProps } from "../views/control"
import { connected, receivedVersion, arbitraryValChanged, RootAction } from "../actions"
import AriaJsonRPC from '../model/rpc'
import { RootState } from "../reducer"

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
        setUp: (url, token, onRes, onErr) => {
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
                refreshLoopId = window.setInterval(() => { refreshTasks(rpc) }, 500)
            })
        },
        tearDown: (rpc, _onRes, onErr) => {
            clearInterval(refreshLoopId)
            rpc.call("aria2.shutdown", [])
            rpc.removeResponseCallback(onErr)
            rpc.removeErrorCallback(onErr)
        },
        purgeTasks: (rpc) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => {refreshTasks(rpc)})            
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Control)