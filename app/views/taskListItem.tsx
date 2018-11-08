import * as React from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Collapse from '@material-ui/core/Collapse'
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

import TaskContextMenu from './taskContextMenu'

// `import * as filesize` also works, but reported as error by tslint
// `import filesize` passes lint, but triggers error at runtime
import filesize = require('filesize')

import SmallTooltip from './smallTooltip'
import { Task, getName, isBittorrent, downloadComplete, isHttp } from '../model/task'
import TaskDetailsView from './taskDetailsView';

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
    status: {
        display: "inline",
        marginRight: `${theme.spacing.unit}px`
    },
    inline: {
        display: "inline"
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
    },
    detailsView: {
        paddingTop: `${theme.spacing.unit}px`,
        paddingBottom: `${theme.spacing.unit}px`
    }
})

interface TaskListItemProps {
    classes: any
    task: Task
    handlePauseTask: () => void
    handleResumeTask: () => void
    handleDeleteTask: () => void
    handlePermDeleteTask: () => void
    handleRevealFile: () => void
    openContextMenu: (menu: JSX.Element, event: React.MouseEvent) => void
}

interface TaskListItemState {
    showDetails: boolean
}

class TaskListItem extends React.Component<TaskListItemProps, TaskListItemState> {
    constructor(props) {
        super(props)
        this.state = {
            showDetails: false
        }
    }

    toggleDetailView = () => {
        this.setState({ showDetails: !this.state.showDetails })
    }

    onMouseUp = (event) => {
        if (event.button === 0) {
            this.toggleDetailView()
        }
    }

    onButtonMouseUp = (event) => {
        event.stopPropagation()
    }

    onContext = (event: React.MouseEvent) => {
        const menu = <TaskContextMenu
            task={this.props.task}
            handlePauseTask={this.props.handlePauseTask}
            handleResumeTask={this.props.handleResumeTask}
            handleDeleteTask={this.props.handleDeleteTask}
            handlePermDeleteTask={this.props.handlePermDeleteTask}
            handleRevealFile={this.props.handleRevealFile}        
        />
        this.props.openContextMenu(menu, event)
    }
    
    render() {
        const { classes, task } = this.props
        const { status } = task

        const downloadSpeed = parseInt(task.downloadSpeed)
        const uploadSpeed = parseInt(task.uploadSpeed)
        const completedLength = parseInt(task.completedLength)
        const totalLength = parseInt(task.totalLength)
        const uploadLength = parseInt(task.uploadLength)

        const fsize = filesize.partial({spacer: ""})
        const taskName = getName(task)
        const progressPercentage = totalLength === 0 ? "" :
            sprintf("%.1f", 100 * completedLength / totalLength) + "%"
        const progressDescription = (downloadComplete(task)) ?
            `${fsize(uploadLength)} uploaded` : `${progressPercentage} downloaded`
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
            Math.floor((totalLength - completedLength) / downloadSpeed) * 1000)
        const speedAndTimeRemaining = timeRemaining + " " + speedDescription

        const button = (tooltipText, icon, onClick) => (
            <SmallTooltip title={tooltipText}>
                <IconButton
                    classes={{root: classes.button}}
                    onClick={onClick}
                    onMouseUp={this.onButtonMouseUp}
                >
                    { icon }
                </IconButton>
            </SmallTooltip>
        )

        const pauseButton = button("Pause", <PauseIcon />, this.props.handlePauseTask)
        const resumeButton = button("Resume", <PlayArrowIcon />, this.props.handleResumeTask)

        const deleteButton =
            (status !== "error" && status !== "removed" && status !== "complete") ?
                button("Delete", <DeleteIcon />, this.props.handleDeleteTask) :
                button("Delete forever", <DeleteForeverIcon />, this.props.handlePermDeleteTask)

        const openFolderButton = button("Open folder", <FolderIcon />, this.props.handleRevealFile)

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
        
        const basicInfo = (
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
                        classes={{root: classes.status}}
                        component="span"
                    >
                        {status}
                    </Typography>
                    <Typography
                        variant="caption"
                        align="left"
                        classes={{root: classes.inline}}
                        component="span"
                    >
                        {`${fsize(totalLength)}`}
                    </Typography>
                </div>
                { buttons }
            </div>
        )

        return (
            <Paper className={classes.root} onContextMenu={this.onContext} onMouseUp={this.onMouseUp}>
                <div className={classes.mainArea}>
                    { basicInfo }
                    <Collapse in={this.state.showDetails}>
                        <TaskDetailsView task={task} classes={{root: classes.detailsView}}/>
                    </Collapse>
                    { (status === "active") ? progressText : "" }
                </div>
                
                { (status === "active" && !downloadComplete(task)) ? progressBar : "" }
            </Paper>
        )
    }
}

export default withStyles(styles)(TaskListItem)