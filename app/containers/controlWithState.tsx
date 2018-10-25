import { connect } from "react-redux"

import Control from "../views/control"
import { connected, receivedVersion, arbitraryValChanged } from "../actions"
import AriaJsonRPC from '../model/rpc'

function mapStateToProps(state) {
    return {
        rpc: state.rpc,
        version: state.version,
        hostUrl: state.hostUrl,
        token: state.token
    }
}

let refreshLoopId

function mapDispatchToProps(dispatch) {
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
                dispatch(connected(jrpc))
                rpc = jrpc
                rpc.addResponseCallback(onRes)
                rpc.addErrorCallback(onErr)
                return rpc.call("aria2.getVersion", [])
            }).then( ({version}) => {
                dispatch(receivedVersion(version))
                refreshLoopId = setInterval(() => { refreshTasks(rpc) }, 500)
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