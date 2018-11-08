import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/Folder'


import { Task } from '../model/task'

interface Props {
    task: Task
    handlePauseTask: () => void
    handleResumeTask: () => void
    handleDeleteTask: () => void
    handlePermDeleteTask: () => void
    handleRevealFile: () => void
}

class TaskContextMenu extends React.Component<Props, {}> {
    render() {
        const { status } = this.props.task

        const pauseListItem = (
            <MenuItem onClick={this.props.handlePauseTask}>
                <ListItemIcon>
                    <PauseIcon />
                </ListItemIcon>
                <ListItemText inset primary="Pause" />
            </MenuItem>
        )
        
        const resumeListItem = (
            <MenuItem onClick={this.props.handleResumeTask}>
                <ListItemIcon>
                    <PlayArrowIcon />
                </ListItemIcon>
                <ListItemText inset primary="Resume" />
            </MenuItem>
        )
        
        const deleteListItem = (
            status !== "error" && status !== "removed" && status !== "complete" ?
                (<MenuItem onClick={this.props.handleDeleteTask}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Delete" />
                </MenuItem>) :
                (<MenuItem onClick={this.props.handlePermDeleteTask}>
                    <ListItemIcon>
                        <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText inset primary="Delete forever" />
                </MenuItem>)
        )
        
        const openFolderListItem = (
            <MenuItem onClick={this.props.handleRevealFile}>
                <ListItemIcon>
                    <FolderIcon />
                </ListItemIcon>
                <ListItemText inset primary="Open folder" />
            </MenuItem>
        )


        return (
            <Paper>
                <MenuList>
                    {
                    status === "active" ?
                        pauseListItem :
                    status === "paused" ?
                        resumeListItem : ""
                    }
                    { deleteListItem }
                    { openFolderListItem }
                </MenuList>
            </Paper>
        )
    }
}




export default TaskContextMenu