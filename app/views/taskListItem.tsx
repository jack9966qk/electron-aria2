import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/Folder'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

// `import * as filesize` also works, but reported as error by tslint
// `import filesize` passes lint, but triggers error at runtime
import filesize = require('filesize')

import SmallTooltip from './smallTooltip'
import { Task, getName, isBittorrent } from '../model/task'

const styles = (theme: Theme) => createStyles({
    root: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        margin: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 0.5}px`,
    },
    progressBar: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    flexContainer: {
        display: "flex",
        alignItems: "center"
    },
    button: {
    },
    text: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    name: {
        flex: 1,
        // necessary for flex item to be smaller than content size
        minWidth: "0px"
    },
    progressText: {
    },
    speedText: {
        flex: 1
    }
})

interface TaskListItemProps {
    classes: any
    task: Task
    handlePauseTask: any
    handleResumeTask: any
    handleDeleteTask: any
    handlePermDeleteTask: any
    handleRevealFile: any
}

interface TaskListItemState {

}

class TaskListItem extends React.Component<TaskListItemProps, TaskListItemState> {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { classes, task } = this.props
        const { status, files, dir } = task
        // const description = `Task: ${status}, ${files[0].path}`
        const downloadSpeed = parseInt(task.downloadSpeed)
        const completedLength = parseInt(task.completedLength)
        const totalLength = parseInt(task.totalLength)
        const taskName = getName(task)
        const speedDescription = isBittorrent(task) ?
            `Seeders:${task.numSeeders} UL:${filesize(parseInt(task.uploadSpeed))}/s DL:${filesize(downloadSpeed)}/s` :
            `${filesize(downloadSpeed)}/s`


        const pauseButton = (
            <SmallTooltip title="Pause">
                <IconButton className={classes.button} onClick={this.props.handlePauseTask}>
                    <PauseIcon />
                </IconButton>
            </SmallTooltip>
        )

        const resumeButton = (
            <SmallTooltip title="Resume">
                <IconButton className={classes.button} onClick={this.props.handleResumeTask}>
                    <PlayArrowIcon />
                </IconButton>
            </SmallTooltip>
        )

        const deleteButton = (
            status !== "error" && status !== "removed" && status !== "complete" ?
                (<SmallTooltip title="Delete">
                    <IconButton className={classes.button} onClick={this.props.handleDeleteTask}>
                        <DeleteIcon />
                    </IconButton>
                </SmallTooltip>) :
                (<SmallTooltip title="Delete forever">
                    <IconButton className={classes.button} onClick={this.props.handlePermDeleteTask}>
                        <DeleteForeverIcon />
                    </IconButton>
                </SmallTooltip>)
        )

        const openFolderButton = (
            <SmallTooltip title="Open folder">
                <IconButton className={classes.button} onClick={this.props.handleRevealFile}>
                    <FolderIcon />
                </IconButton>
            </SmallTooltip>
        )

        const buttons = (
            <>
                {
                status === "active" ?
                    pauseButton :
                status === "paused" ?
                    resumeButton : ""
                }
                { deleteButton }
                { openFolderButton }
            </>
        )

        const progressText = (
            <div className={classes.flexContainer}>
                <Typography
                    variant="caption"
                    align="left"
                    classes={{root: classes.progressText}}
                >
                    {
                    status === "active" || status === "paused" ?
                        `${filesize(completedLength)}/${filesize(totalLength)}` :
                        `${filesize(totalLength)}`
                    }
                </Typography>
                <Typography
                    variant="caption"
                    align="right"
                    classes={{root: classes.speedText}}
                >
                    {status === "active" ? speedDescription : ""}
                </Typography>
            </div>
        )

        const progressBar = status === "active" && totalLength === 0 ?
            <LinearProgress
                className={classes.progressBar}
                variant="indeterminate"
            /> :
            <LinearProgress
                className={classes.progressBar}
                variant="determinate"
                value={completedLength * 100.0 / totalLength}
            />

        return (
            <Paper className={classes.root}>
                <div className={classes.flexContainer}>
                    <div className={classes.name}>
                        <Typography
                            variant="subtitle1"
                            align="left"
                            classes={{root: classes.text}}
                        >
                            {taskName}
                        </Typography>
                        <Typography
                            variant="body2"
                            align="left"
                            classes={{root: classes.text}}
                        >
                            {status}
                        </Typography>
                    </div>
                    { buttons }
                </div>

                { status === "active" ? progressBar : "" }

                {
                (
                    (status === "active") ||
                    (status === "complete" && isBittorrent(task))
                ) ?
                    progressText : ""
                }

            </Paper>
        )
    }
}

export default withStyles(styles)(TaskListItem)