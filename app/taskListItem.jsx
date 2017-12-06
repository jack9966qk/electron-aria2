import React from 'React'

import { ListItem, ListItemText } from 'material-ui/List'
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
    progressText: {
    },
    filenameGrid: {
        [theme.breakpoints.up('sm')]: {
            lineHeight: "48px"
        },
    }
})

class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { status, files, dir, downloadSpeed, completedLength, totalLength } = this.props.task
        const description = `Task: ${status}, ${files[0].path}`
        const bittorrent = this.props.task.bittorrent
        const taskName = bittorrent === undefined || bittorrent.info === undefined ?
            files[0].path.replace(dir + "/", "") :
            this.props.task.bittorrent.info.name

        const pauseButton = (
            <IconButton onClick={this.props.handlePauseTask}>
                <PauseIcon />
            </IconButton>
        )

        const resumeButton = (
            <IconButton onClick={this.props.handleResumeTask}>
                <PlayArrowIcon />
            </IconButton>
        )

        // const deleteButton = (
        //     status === "active" ?
        //     <IconButton onClick={this.props.handleDeleteTask}>
        //         <DeleteIcon />
        //     </IconButton> :
        //     <IconButton onClick={this.props.handlePermDeleteTask}>
        //         <DeleteForeverIcon />
        //     </IconButton>
        // )

        const deleteButton = (
        status !== "error" && status !== "removed" && status !== "complete" ?
            <IconButton onClick={this.props.handleDeleteTask}>
                <DeleteIcon />
            </IconButton> :
            <IconButton onClick={this.props.handlePermDeleteTask}>
                <DeleteForeverIcon />
            </IconButton>
        )

        const progress = totalLength === "0" ?
            <LinearProgress
                className={this.props.classes.progressBar}
                mode="indeterminate"
            /> :
            <LinearProgress
                className={this.props.classes.progressBar}
                mode="determinate"
                value={completedLength * 100.0 / totalLength}
            />

        return (
            <Paper className={this.props.classes.root}>
                <Grid container justify="space-between">
                    <Grid item xs={6} sm={9} className={this.props.classes.filenameGrid}>
                        <Typography
                            style={{display: "block", verticalAlign: "middle"}}
                            type="subheading"
                            align="left"
                            component="span"
                            noWrap
                            className={this.props.classes.text}
                        >
                            {taskName}
                        </Typography>
                        <Typography
                            style={{display: "block", verticalAlign: "middle"}}
                            type="body1"
                            align="left"
                            component="span"
                            className={this.props.classes.text}
                        >
                            {status}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
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
                                <IconButton onClick={this.props.handleRevealFile}>
                                    <FolderIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                { status === "complete" ? "" : progress }
                <Grid container justify="center" spacing={0} className={this.props.classes.progressText}>
                    <Grid item xs={6} sm={6}>
                        <Typography type="caption" align="left">
                            {status === "active" || status === "paused" ?
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
            // <ListItem button>
            //     <ListItemText primary={description} />
            // </ListItem>
        )
    }
}

export default withStyles(styles)(TaskListItem)