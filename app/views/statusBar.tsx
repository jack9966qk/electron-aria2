import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

import { Task } from '../model/task'

import filesize = require('filesize')

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        justifyContent: "flex-end",
        padding: `${theme.spacing.unit}px`,
        paddingRight: `${theme.spacing.unit * 1.5}px`,
        borderRadius: `0px`
    }
})

interface Props {
    tasks: Map<string, Task>
    classes: any
}

class StatusBar extends React.Component<Props, {}> {
    render() {
        const { tasks } = this.props
        const totalOf = (fn: (Task) => number) => Array.from(tasks.values()).reduce((n, t) => n + fn(t), 0)

        const totalDownloadSpeed = filesize(totalOf(t => parseInt(t.downloadSpeed)))
        const totalUploadSpeed = filesize(totalOf(t => parseInt(t.uploadSpeed)))
        return (
            <Paper classes={{root: this.props.classes.root}} elevation={4}>
                <Typography variant="body1">
                    {`Up: ${totalUploadSpeed}/s Down: ${totalDownloadSpeed}/s`}
                </Typography>
            </Paper>
        )
    }
}

export default withStyles(styles)(StatusBar)