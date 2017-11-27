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
    text: {}
})

class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { status, files, dir, completedLength, totalLength } = this.props.task
        console.log(files)
        const description = `Task: ${status}, ${files[0].path}`
        return (
            <Paper className={this.props.classes.root}>
                <Grid container justify="center">
                    <Grid item xs={5}>
                        <Typography type="body1" component="span" className={this.props.classes.text}>
                            {files[0].path.replace(dir + "/", "")}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography type="body1" component="span" className={this.props.classes.text}>
                            {status}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography type="body1" component="span" className={this.props.classes.text}>
                            {filesize(totalLength)}
                        </Typography>
                    </Grid>
                    {
                    status === "active" ?
                        <Grid item xs={1}>
                            <IconButton onClick={this.props.handlePauseTask}>
                                <PauseIcon />
                            </IconButton>
                        </Grid> :
                        status === "paused" ? 
                        <Grid item xs={1}>
                            <IconButton onClick={this.props.handleResumeTask}>
                                <PlayArrowIcon />
                            </IconButton>
                        </Grid> :
                        ""
                    }
                    {
                    status === "active" ?
                    <Grid item xs={1}>
                        <IconButton onClick={this.props.handleDeleteTask}>
                            <DeleteIcon />
                        </IconButton>
                    </Grid> :
                    <Grid item xs={1}>
                        <IconButton onClick={this.props.handlePermDeleteTask}>
                            <DeleteForeverIcon />
                        </IconButton>
                    </Grid>
                    }
                    <Grid item xs={1}>
                        <IconButton onClick={this.props.handleRevealFile}>
                            <FolderIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <LinearProgress mode="determinate" value={completedLength * 100.0 / totalLength} />
            </Paper>
            // <ListItem button>
            //     <ListItemText primary={description} />
            // </ListItem>
        )
    }
}

export default withStyles(styles)(TaskListItem)