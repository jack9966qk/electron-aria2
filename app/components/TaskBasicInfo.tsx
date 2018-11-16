import * as React from "react"
import AriaJsonRPC from "../model/rpc"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/Folder'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SmallTooltip from './SmallTooltip'
import Typography from "@material-ui/core/Typography"
import { createStyles, withStyles } from "@material-ui/core/styles"
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { filesize as fsize } from "../model/utility"

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        alignItems: "center"
    },
    button: {
        padding: `${theme.spacing.unit * 0.75}px`
    },
    status: {
        display: "inline",
        marginRight: `${theme.spacing.unit}px`
    },
    name: {
        flex: 1,
        // necessary for flex item to be smaller than content size
        minWidth: "0px"
    },
    text: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    inline: {
        display: "inline"
    }
})

export interface ViewProps {
    rpc: AriaJsonRPC
    gid: string
}

export interface StoreProps {
    taskName: string
    status: string
    totalLength: number
    path: string
}

export interface DispatchProps {
    pauseTask: (rpc: AriaJsonRPC, gid: string) => void
    resumeTask: (rpc: AriaJsonRPC, gid: string) => void
    deleteTask: (rpc: AriaJsonRPC, gid: string) => void
    permDeleteTask: (rpc: AriaJsonRPC, gid: string) => void
    revealFile: (string) => void
    openFile: (string) => void
}

type Props = ViewProps & StoreProps & DispatchProps & { classes: any }

class TaskBasicInfo extends React.PureComponent<Props> {
    onButtonMouseUp = (event) => {
        event.stopPropagation()
    }

    render() {
        const {
            classes,
            taskName,
            status,
            totalLength,
            path,
            rpc,
            gid
        } = this.props

        const button = (tooltipText, icon, onClick) => (
            <SmallTooltip title={tooltipText}>
                <IconButton
                    classes={{ root: classes.button }}
                    onClick={onClick}
                    onMouseUp={this.onButtonMouseUp}
                >
                    {icon}
                </IconButton>
            </SmallTooltip>
        )

        const pauseTask = () => { this.props.pauseTask(rpc, gid) }
        const resumeTask = () => { this.props.resumeTask(rpc, gid) }
        const deleteTask = () => { this.props.deleteTask(rpc, gid) }
        const permDeleteTask = () => { this.props.permDeleteTask(rpc, gid) }
        const revealFile = () => { this.props.revealFile(path) }

        const pauseButton = button("Pause", <PauseIcon />, pauseTask)
        const resumeButton = button("Resume", <PlayArrowIcon />, resumeTask)

        const deleteButton = status === "active" ?
                button("Delete", <DeleteIcon />, deleteTask) :
                button("Delete forever", <DeleteForeverIcon />,
                    status === "paused" ? deleteTask : permDeleteTask)

        const openFolderButton = button("Open folder", <FolderIcon />, revealFile)

        const buttons = (
            <>
                {
                    status === "active" ?
                        pauseButton :
                        status === "paused" ?
                            resumeButton : ""
                }
                {deleteButton}
                {openFolderButton}
            </>
        )

        return (
            <div className={classes.root}>
                <div className={classes.name}>
                    <Typography
                        variant="subtitle1"
                        align="left"
                        classes={{ root: classes.text }}
                    >
                        {taskName}
                    </Typography>
                    <Typography
                        variant="body2"
                        align="left"
                        classes={{ root: classes.status }}
                        component="span"
                    >
                        {status}
                    </Typography>
                    <Typography
                        variant="caption"
                        align="left"
                        classes={{ root: classes.inline }}
                        component="span"
                    >
                        {`${fsize(totalLength)}`}
                    </Typography>
                </div>
                {buttons}
            </div>
        )
    }
}

export default withStyles(styles)(TaskBasicInfo)