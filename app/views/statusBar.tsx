import * as React from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'
import createStyles from '@material-ui/core/styles/createStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

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
    totalDownloadSpeed: number
    totalUploadSpeed: number
    classes: any
}

class StatusBar extends React.Component<Props, {}> {
    render() {
        const { totalDownloadSpeed, totalUploadSpeed, classes } = this.props
        const dl = filesize(totalDownloadSpeed)
        const ul = filesize(totalUploadSpeed)
        return (
            <Paper classes={{root: classes.root}} elevation={4}>
                <Typography variant="body1">
                    {`Up: ${ul}/s Down: ${dl}/s`}
                </Typography>
            </Paper>
        )
    }
}

export default withStyles(styles)(StatusBar)