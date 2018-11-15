import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/Folder'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import * as React from 'react'
import AriaJsonRPC from '../model/rpc'

export interface ViewProps {
    rpc: AriaJsonRPC
    gid: string
}

export interface StoreProps {
    status: string
    path: string
}

export interface DispatchProps {
    pauseTask: (rpc: AriaJsonRPC, gid: string) => void
    resumeTask: (rpc: AriaJsonRPC, gid: string) => void
    deleteTask: (rpc: AriaJsonRPC, gid: string) => void
    permDeleteTask: (rpc: AriaJsonRPC, gid: string) => void
    revealFile: (path: string) => void
}

type Props = ViewProps & StoreProps & DispatchProps

class TaskContextMenu extends React.PureComponent<Props, {}> {
    render() {
        const { status, rpc, gid, path } = this.props

        const menuItem = (label, icon, func) => (
            <MenuItem onClick={func}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText inset primary={label} />
            </MenuItem>
        )

        const pauseTask = () => { this.props.pauseTask(rpc, gid) }
        const resumeTask = () => { this.props.resumeTask(rpc, gid) }
        const deleteTask = () => { this.props.deleteTask(rpc, gid) }
        const permDeleteTask = () => { this.props.permDeleteTask(rpc, gid) }
        const revealFile = () => { this.props.revealFile(path) }

        const pauseListItem = menuItem("Pause", <PauseIcon />, pauseTask)
        const resumeListItem = menuItem("Resume", <PlayArrowIcon />, resumeTask)
        const deleteListItem = status === "active" ?
            menuItem("Delete", <DeleteIcon />, deleteTask) :
            menuItem("Delete forever", <DeleteForeverIcon />,
                status === "paused" ? deleteTask : permDeleteTask)
        const openFolderListItem = menuItem("Open folder", <FolderIcon />, revealFile)

        return (
            <Paper>
                <MenuList>
                    {
                        status === "active" ?
                            pauseListItem :
                            status === "paused" ?
                                resumeListItem : ""
                    }
                    {deleteListItem}
                    {openFolderListItem}
                </MenuList>
            </Paper>
        )
    }
}




export default TaskContextMenu