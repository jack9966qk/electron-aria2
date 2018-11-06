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
import { sprintf } from 'sprintf-js'
import * as humanizeDuration from 'humanize-duration'

// `import * as filesize` also works, but reported as error by tslint
// `import filesize` passes lint, but triggers error at runtime
import filesize = require('filesize')

import SmallTooltip from './smallTooltip'
import { Task, getName, isBittorrent, downloadComplete, isHttp } from '../model/task'

const styles = (theme: Theme) => createStyles({
    root: {
        margin: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 0.5}px`,
        // hide content outside of rounded corners
        overflow: "hidden",
        // necessary for above to work, see: https://bit.ly/2OqGslz
        position: "relative",
        zIndex: theme.zIndex.drawer
    },
    mainArea: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
    },
    progressBar: {
    },
    flexContainer: {
        display: "flex",
        alignItems: "center"
    },
    button: {
        padding: `${theme.spacing.unit * 0.75}px`
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
        const { status } = task

        const downloadSpeed = parseInt(task.downloadSpeed)
        const uploadSpeed = parseInt(task.uploadSpeed)
        const completedLength = parseInt(task.completedLength)
        const totalLength = parseInt(task.totalLength)

        const fsize = filesize.partial({spacer: ""})
        const taskName = getName(task)
        const progressPercentage = totalLength === 0 ? "" :
            sprintf("%.1f", 100 * completedLength / totalLength) + "%"
        const progressDescription = (status === "active" || status === "paused") ?
            `${progressPercentage} of ${fsize(totalLength)}` :
            `${fsize(totalLength)}`
        const speedDescription = isBittorrent(task) ?
            (downloadComplete(task) ?
                `UL:${fsize(uploadSpeed)}/s` :
                `UL:${fsize(uploadSpeed)}/s DL:${fsize(downloadSpeed)}/s`
            ) :
            `${fsize(downloadSpeed)}/s`
        const humanizer = humanizeDuration.humanizer({
            delimiter: "",
            spacer: "",
            largest: 2,
            round: true,
            language: "shortEn",
            languages: {
                shortEn: {
                    y: () => 'y',
                    mo: () => 'mo',
                    w: () => 'w',
                    d: () => 'd',
                    h: () => 'h',
                    m: () => 'm',
                    s: () => 's',
                    ms: () => 'ms',
                }
            }
        })
        const timeRemaining = downloadSpeed === 0 ? "" : humanizer(
            Math.floor((totalLength - completedLength) / downloadSpeed))
        const speedAndTimeRemaining = timeRemaining + " " + speedDescription

        const pauseButton = (
            <SmallTooltip title="Pause">
                <IconButton classes={{root: classes.button}} onClick={this.props.handlePauseTask}>
                    <PauseIcon />
                </IconButton>
            </SmallTooltip>
        )

        const resumeButton = (
            <SmallTooltip title="Resume">
                <IconButton classes={{root: classes.button}} onClick={this.props.handleResumeTask}>
                    <PlayArrowIcon />
                </IconButton>
            </SmallTooltip>
        )

        const deleteButton = (
            status !== "error" && status !== "removed" && status !== "complete" ?
                (<SmallTooltip title="Delete">
                    <IconButton classes={{root: classes.button}} onClick={this.props.handleDeleteTask}>
                        <DeleteIcon />
                    </IconButton>
                </SmallTooltip>) :
                (<SmallTooltip title="Delete forever">
                    <IconButton classes={{root: classes.button}} onClick={this.props.handlePermDeleteTask}>
                        <DeleteForeverIcon />
                    </IconButton>
                </SmallTooltip>)
        )

        const openFolderButton = (
            <SmallTooltip title="Open folder">
                <IconButton classes={{root: classes.button}} onClick={this.props.handleRevealFile}>
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
                    {progressDescription}
                </Typography>
                <Typography
                    variant="caption"
                    align="right"
                    classes={{root: classes.speedText}}
                >
                    {status === "active" ? speedAndTimeRemaining : ""}
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
                <div className={classes.mainArea}>
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

                    {
                    (
                        (status === "active") ||
                        (status === "complete" && isBittorrent(task))
                    ) ?
                        progressText : ""
                    }
                </div>
                
                { (status === "active" && !downloadComplete(task)) ? progressBar : "" }
            </Paper>
        )
    }
}

export default withStyles(styles)(TaskListItem)