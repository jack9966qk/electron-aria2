import { connect } from "react-redux"

import NewTaskDialog from "../views/newTaskDialog.jsx"
import { arbitraryValChanged } from "../actions"
import AriaJsonRPC from '../model/rpc'

function mapStateToProps(state) {
    return {
        rpc: state.rpc,
        defaultDir: state.defaultDir
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addTask: (rpc, uri, dir) => {
            rpc.call("aria2.addUri", [[uri], {dir}]).then(gid => {
                console.log("gid for new task: " + gid)
                return rpc.getAllTasks()
            }).then(tasks => {
                dispatch(arbitraryValChanged("tasks", tasks))                
            })
        },
        addTorrent: (rpc, torrent, dir) => {
            rpc.call("aria2.addTorrent", [torrent, [], {dir}]).then(gid => {
                console.log("gid for new task: " + gid)
                return rpc.getAllTasks()
            }).then(tasks => {
                dispatch(arbitraryValChanged("tasks", tasks))                
            })
        },
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(NewTaskDialog)