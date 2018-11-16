import Card from '@material-ui/core/Card'
import Collapse from '@material-ui/core/Collapse'
import LinearProgress from '@material-ui/core/LinearProgress'
import { createStyles, withStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { sprintf } from 'sprintf-js'
import { filesize as fsize, humanizeDuration as humanizer } from '../model/utility'
import TaskDetailsView from './TaskDetailsView'
import AriaJsonRPC from '../model/rpc'
import {
    downloadComplete,
    getName,
    isBittorrent,
    Task
} from '../model/task'
import TaskBasicInfoWithState from '../containers/TaskBasicInfoWithState'
import TaskContextMenuWithState from '../containers/TaskContextMenuWithState'

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
    progressText: {
    },
    flexContainer: {
        display: "flex",
        alignItems: "center"
    },
    speedText: {
        flex: 1
    },
    detailsView: {
        paddingTop: `${theme.spacing.unit}px`,
        paddingBottom: `${theme.spacing.unit}px`
    }
})

export interface Props {
    classes: any
    task: Task
    rpc: AriaJsonRPC
    openContextMenu: (menu: JSX.Element, event: React.MouseEvent) => void
}

interface State {
    expanded: boolean
    renderDetails: boolean
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
        const menu = <TaskContextMenuWithState
            rpc={this.props.rpc}
            gid={this.props.task.gid}
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

        const progressPercentage = totalLength === 0 ? "0.0%" :
            sprintf("%.1f", Math.floor(1000 * completedLength / totalLength) / 10) + "%"
        const progressDescription = (downloadComplete(task)) ?
            `${fsize(uploadLength)} uploaded` : `${progressPercentage} downloaded`
        const speedDescription = isBittorrent(task) ?
            (downloadComplete(task) ?
                `UL:${fsize(uploadSpeed)}/s` :
                `UL:${fsize(uploadSpeed)}/s DL:${fsize(downloadSpeed)}/s`
            ) :
            `${fsize(downloadSpeed)}/s`
        
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
                    <TaskBasicInfoWithState
                        rpc={this.props.rpc}
                        gid={this.props.task.gid}
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