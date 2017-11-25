import React from 'React'

import { ListItem, ListItemText } from 'material-ui/List'
import { LinearProgress } from 'material-ui/Progress'
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'

const styles = theme => ({
    root: theme.mixins.gutters({
        flexGrow: 1,
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 1,
    }),
})

class TaskListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        const { status, files, completedLength, totalLength } = this.props.task
        console.log(files)
        const description = `Task: ${status}, ${files[0].path}`
        return (
            <Paper className={this.props.classes.root}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography type="body1">
                            {files[0].path}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography type="body1">
                            {status}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography type="body1">
                            {totalLength}
                        </Typography>
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