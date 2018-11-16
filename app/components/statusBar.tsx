import Paper from '@material-ui/core/Paper'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'

import filesize = require('filesize')

const styles = (theme: Theme) => createStyles({
    root: {
        display: "flex",
        justifyContent: "flex-end",
        padding: `${theme.spacing.unit}px`,
        paddingRight: `${theme.spacing.unit * 1.5}px`,
        borderRadius: `0px`
    },
    up: {
        minWidth: 50,
    },
    speed: {
        textAlign: "right",
        minWidth: 80,
    },
    down: {
        minWidth: 50,
        marginLeft: 20
    }
})

type Props = {
    totalDownloadSpeed: number
    totalUploadSpeed: number
} & WithStyles<typeof styles>

class StatusBar extends React.Component<Props, {}> {
    render() {
        const { totalDownloadSpeed, totalUploadSpeed, classes } = this.props
        const dl = filesize(totalDownloadSpeed)
        const ul = filesize(totalUploadSpeed)
        return (
            <Paper classes={{ root: classes.root }} elevation={4}>
                <Typography variant="body1" classes={{ root: classes.up }}>
                    Up:
                </Typography>
                <Typography variant="body1" classes={{ root: classes.speed }}>
                    {`${ul}/s`}
                </Typography>
                <Typography variant="body1" classes={{ root: classes.down }}>
                    Down:
                </Typography>
                <Typography variant="body1" classes={{ root: classes.speed }}>
                    {`${dl}/s`}
                </Typography>
            </Paper>
        )
    }
}

export default withStyles(styles)(StatusBar)