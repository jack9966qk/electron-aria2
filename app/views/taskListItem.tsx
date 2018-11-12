import Card from '@material-ui/core/Card'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, withStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/Folder'
import PauseIcon from '@material-ui/icons/Pause'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import * as humanizeDuration from 'humanize-duration'
import * as React from 'react'
import { sprintf } from 'sprintf-js'
import SmallTooltip from './smallTooltip'
import TaskContextMenu from './taskContextMenu'
import TaskDetailsView from './taskDetailsView'
import AriaJsonRPC from '../model/rpc'
import {
    downloadComplete,
    getName,
    isBittorrent,
    isHttp,
    Task
    } from '../model/task'


// `import * as filesize` also works, but reported as error by tslint
// `import filesize` passes lint, but triggers error at runtime
import filesize = require('filesize')


const fsize = filesize.partial({ spacer: "" })

const styles = (theme: Theme) => createStyles({
    root: {
        margin: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 0.5}px`,
        // hide content outside of rounded corners
        overflow: "hidden",
        // necessary for above to work, see: https://bit.ly/2OqGslz
        position: "relative",
        zIndex: theme.zIndex.drawer,
        // card raised/not raised transition
        transition: theme.transitions.create('box-shadow', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
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

export interface ViewProps {
    classes: any
    task: Task
    rpc: AriaJsonRPC
    openContextMenu: (menu: JSX.Element, event: React.MouseEvent) => void
}

export interface DispatchProps {
    pauseTask: (rpc: AriaJsonRPC, gid: string) => void
    resumeTask: (rpc: AriaJsonRPC, gid: string) => void
    deleteTask: (rpc: AriaJsonRPC, gid: string) => void
    permDeleteTask: (rpc: AriaJsonRPC, gid: string) => void
    revealFile: (string) => void
    openFile: (string) => void
}

type Props = ViewProps & DispatchProps

interface State {
    expanded: boolean
    renderDetails: boolean
}

class BasicInfo extends React.PureComponent<{
    classes: any
    taskName: string
    status: string
    totalLength: number
    path: string
    rpc: AriaJsonRPC
    gid: string
    pauseTask: (rpc: AriaJsonRPC, gid: string) => void
    resumeTask: (rpc: AriaJsonRPC, gid: string) => void
    deleteTask: (rpc: AriaJsonRPC, gid: string) => void
    permDeleteTask: (rpc: AriaJsonRPC, gid: string) => void
    revealFile: (string) => void
}> {
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

        const deleteButton =
            (status !== "error" && status !== "removed" && status !== "complete") ?
                button("Delete", <DeleteIcon />, deleteTask) :
                button("Delete forever", <DeleteForeverIcon />, permDeleteTask)

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
            <div className={classes.flexContainer}>
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

class TaskListItem extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            renderDetails: false
        }
    }

    toggleDetailView = () => {
        this.setState({ expanded: !this.state.expanded })
    }

    displayDetails = () => {
        this.setState({ renderDetails: true })
    }

    removeDetails = () => {
        // this.setState({ renderDetails: false })
    }

    onMouseUp = (event) => {
        if (event.button === 0) {
            this.toggleDetailView()
        }
    }

    onContext = (event: React.MouseEvent) => {
        const menu = <TaskContextMenu
            status={this.props.task.status}
            path={this.props.task.files[0].path}
            rpc={this.props.rpc}
            gid={this.props.task.gid}
            pauseTask={this.props.pauseTask}
            resumeTask={this.props.resumeTask}
            deleteTask={this.props.deleteTask}
            permDeleteTask={this.props.permDeleteTask}
            revealFile={this.props.revealFile}
        />
        this.props.openContextMenu(menu, event)
    }

    render() {
        const { classes, task } = this.props
        const { status } = task

        const taskName = getName(task)
        const downloadSpeed = parseInt(task.downloadSpeed)
        const uploadSpeed = parseInt(task.uploadSpeed)
        const completedLength = parseInt(task.completedLength)
        const totalLength = parseInt(task.totalLength)
        const uploadLength = parseInt(task.uploadLength)

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



        const progressText = (
            <div className={classes.flexContainer}>
                <Typography
                    variant="caption"
                    align="left"
                    classes={{ root: classes.progressText }}
                >
                    {progressDescription}
                </Typography>
                <Typography
                    variant="caption"
                    align="right"
                    classes={{ root: classes.speedText }}
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
            <Card
                raised={this.state.expanded}
                className={classes.root}
                onContextMenu={this.onContext}
                onMouseUp={this.onMouseUp}
            >
                <div className={classes.mainArea}>
                    <BasicInfo
                        classes={classes}
                        taskName={taskName}
                        totalLength={totalLength}
                        path={task.files[0].path}
                        rpc={this.props.rpc}
                        status={this.props.task.status}
                        gid={this.props.task.gid}
                        pauseTask={this.props.pauseTask}
                        resumeTask={this.props.resumeTask}
                        deleteTask={this.props.deleteTask}
                        permDeleteTask={this.props.permDeleteTask}
                        revealFile={this.props.revealFile}
                    />
                    <Collapse
                        in={this.state.expanded}
                        onEnter={this.displayDetails}
                        onExited={this.removeDetails}
                    >
                        {
                            this.state.renderDetails ?
                                <TaskDetailsView
                                    task={task}
                                    classes={{ root: classes.detailsView }}
                                /> : ""
                        }

                    </Collapse>
                    {(status === "active") ? progressText : ""}
                </div>

                {(status === "active" && !downloadComplete(task)) ? progressBar : ""}
            </Card>
        )
    }
}

export default withStyles(styles)(TaskListItem)