import { connect } from "react-redux"
import { shell } from 'electron'
import TaskListItem, { DispatchProps } from "../views/taskListItem"
import { receivedTasksAndStatus } from "../actions"


function mapDispatchToProps(dispatch): DispatchProps {  
    const refreshList = (rpc) => {
        rpc.getTasksAndStatus().then(({tasks, stat}) => {
            dispatch(receivedTasksAndStatus(tasks, stat))
        })
    }

    return {
        pauseTask: (rpc, gid) => {
            rpc.call("aria2.forcePause", [gid]).then(() => {refreshList(rpc)})
        },
        resumeTask: (rpc, gid) => {
            rpc.call("aria2.unpause", [gid]).then(() => {refreshList(rpc)})
        },
        deleteTask: (rpc, gid) => {
            rpc.call("aria2.forceRemove", [gid]).then(() => {refreshList(rpc)})
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

export default connect(null, mapDispatchToProps)(TaskListItem)