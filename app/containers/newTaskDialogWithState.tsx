import { connect } from "react-redux"

import NewTaskDialog, { DispatchProps, StoreProps } from "../views/newTaskDialog"
import { arbitraryValChanged } from "../actions"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        rpc: state.rpc,
        defaultDir: state.defaultDir
    }
}

function mapDispatchToProps(dispatch): DispatchProps {
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