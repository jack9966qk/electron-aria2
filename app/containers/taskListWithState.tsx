import { connect } from "react-redux"
import { shell } from 'electron'
import TaskList from "../views/taskList"
import { arbitraryValChanged } from '../actions'

function mapStateToProps(state) {
    return {
        tasks: state.tasks,
        rpc: state.rpc
    }
}

function mapDispatchToProps(_dispatch) {

    const refreshList = (rpc) => {
        rpc.getAllTasks().then(tasks => {
            arbitraryValChanged("tasks", tasks)
        })
    }

    return {
        pauseTask: (rpc, gid) => {
            rpc.call("aria2.pause", [gid]).then(() => {refreshList(rpc)})
        },
        resumeTask: (rpc, gid) => {
            rpc.call("aria2.unpause", [gid]).then(() => {refreshList(rpc)})
        },
        deleteTask: (rpc, gid) => {
            rpc.call("aria2.remove", [gid]).then(() => {refreshList(rpc)})
        },
        permDeleteTask: (rpc, gid) => {
            rpc.call("aria2.removeDownloadResult", [gid]).then(() => {refreshList(rpc)})
        },
        revealFile: (path) => {
            shell.showItemInFolder(path)
        },
        openFile: (path) => {
            shell.openItem(path)
        },
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(TaskList)