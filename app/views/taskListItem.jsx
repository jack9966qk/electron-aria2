import React from 'React'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import PauseIcon from 'material-ui-icons/Pause'
import PlayArrowIcon from 'material-ui-icons/PlayArrow'
import DeleteIcon from 'material-ui-icons/Delete'
import DeleteForeverIcon from 'material-ui-icons/DeleteForever'
import FolderIcon from 'material-ui-icons/Folder'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import filesize from 'filesize'

import SmallTooltip from './smallTooltip.jsx'

const styles = theme => ({
    root: theme.mixins.gutters({
        flexGrow: 1,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 2,
        marginLeft: theme.spacing.unit * 1,
        marginRight: theme.spacing.unit * 1,
    }),
    progressBar: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    text: {
        display: "block",
        verticalAlign: "middle"
    },
    progressText: {
    },
    filenameGrid: {
        [theme.breakpoints.up("sm")]: {
            lineHeight: "48px"
        },
    },
})

class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { classes } = this.props
        const { status, files, dir, downloadSpeed, completedLength, totalLength } = this.props.task
        const description = `Task: ${status}, ${files[0].path}`
        const bittorrent = this.props.task.bittorrent
        const taskName = bittorrent === undefined || bittorrent.info === undefined ?
            files[0].path.replace(dir + "/", "") :
            this.props.task.bittorrent.info.name

        const pauseButton = (
            <SmallTooltip title="Pause">
                <IconButton onClick={this.props.handlePauseTask}>
                    <PauseIcon />
                </IconButton>
            </SmallTooltip>
        )

        const resumeButton = (
            <SmallTooltip title="Resume">
                <IconButton onClick={this.props.handleResumeTask}>
                    <PlayArrowIcon />
                </IconButton>
            </SmallTooltip>
        )

        const deleteButton = (
            status !== "error" && status !== "removed" && status !== "complete" ?
                (<SmallTooltip title="Delete">
                    <IconButton onClick={this.props.handleDeleteTask}>
                        <DeleteIcon />
                    </IconButton>
                </SmallTooltip>) :
                (<SmallTooltip title="Delete forever">
                    <IconButton onClick={this.props.handlePermDeleteTask}>
                        <DeleteForeverIcon />
                    </IconButton>
                </SmallTooltip>)
        )

        const openFolderButton = (
            <SmallTooltip title="Open folder">
                <IconButton onClick={this.props.handleRevealFile}>
                    <FolderIcon />
                </IconButton>
            </SmallTooltip>
        )

        const buttons = (
            <Grid container spacing={0} justify="flex-end">
                {
                status === "active" ?
                    <Grid item sm={4}> {pauseButton} </Grid> :
                status === "paused" ?
                    <Grid item sm={4}> {resumeButton} </Grid> : ""
                }
                <Grid item sm={4}>
                    { deleteButton }
                </Grid>
                <Grid item sm={4}>
                    { openFolderButton }
                </Grid>
            </Grid>
        )

        const progress = totalLength === "0" ?
            <LinearProgress
                className={classes.progressBar}
                mode="indeterminate"
            /> :
            <LinearProgress
                className={classes.progressBar}
                mode="determinate"
                value={completedLength * 100.0 / totalLength}
            />

        return (
            <Paper className={this.props.classes.root}>

                <Grid container justify="space-between">
                    <Grid item xs={6} sm={9} className={classes.filenameGrid}>
                        <Typography
                            type="subheading"
                            align="left"
                            component="span"
                            noWrap
                            className={classes.text}
                        >
                            {taskName}
                        </Typography>
                        <Typography
                            type="body1"
                            align="left"
                            component="span"
                            className={classes.text}
                        >
                            {status}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        { buttons }
                    </Grid>
                </Grid>

                { status === "complete" ? "" : progress }

                <Grid container justify="center" spacing={0} className={classes.progressText}>
                    <Grid item xs={6} sm={6}>
                        <Typography type="caption" align="left">
                            {
                            status === "active" || status === "paused" ?
                                `${filesize(completedLength)}/${filesize(totalLength)}` :
                                `${filesize(totalLength)}`
                            }
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Typography type="caption" align="right">
                            {status === "active" ? `${filesize(downloadSpeed)}/s` : ""}
                        </Typography>
                    </Grid>
                </Grid>

            </Paper>
        )
    }
}

export default withStyles(styles)(TaskListItem)