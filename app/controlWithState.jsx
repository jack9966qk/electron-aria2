import { connect } from "react-redux"

import Control from "./control.jsx"
import { connected, receivedVersion, arbitraryValChanged } from "./actions"
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
        setUp: (url, token) => {
            let rpc
            return AriaJsonRPC.connectToServer(url, token).then(jrpc => {
                dispatch(connected(jrpc))
                rpc = jrpc
                return rpc.call("aria2.getVersion", [])
            }).then( ({version}) => {
                dispatch(receivedVersion(version))
                refreshLoopId = setInterval(() => { refreshTasks(rpc) }, 500)
            })
        },
        purgeTasks: (rpc) => {
            rpc.call("aria2.purgeDownloadResult", []).then(() => {refreshList(rpc)})            
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Control)