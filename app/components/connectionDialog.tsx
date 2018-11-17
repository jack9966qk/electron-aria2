import Button from '@material-ui/core/Button'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import * as React from 'react'
import ResponsiveDialog from './ResponsiveDialog'
import { DialogContentText } from '@material-ui/core'

const styles = (theme: Theme) => createStyles({
    root: {},
    marginButtom: {
        marginBottom: theme.spacing.unit
    },
    marginTop: {
        marginTop: theme.spacing.unit * 3
    }
})

interface ViewProps {
    open: boolean
    onRequestConnect: (hostUrl: string, secret: string) => void
    onRequestClose: () => void
}

export interface DispatchProps {
}

export interface StoreProps {
    hostUrl: string
    secret: string
    version: string
    enabledFeatures: string[]
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps &
    WithStyles<typeof styles>

interface State {
    newUrl: string
    newSecret: string
}

class ConnectionDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newUrl: this.props.hostUrl,
            newSecret: this.props.secret
        }
    }

    connect = () => {
        const { newUrl, newSecret } = this.state
        this.props.onRequestConnect(newUrl, newSecret)
        this.props.onRequestClose()
    }

    updateHostUrl = (newUrl) => {
        this.setState({ newUrl })
    }

    updateSecret = (newSecret) => {
        this.setState({ newSecret })
    }

    render() {
        return (
            <ResponsiveDialog
                open={this.props.open}
                onClose={this.props.onRequestClose}
                fullWidth={true}
                disableRestoreFocus // for tooltips: https://bit.ly/2z4suAV
            >
                <DialogTitle>Aria2 Connection</DialogTitle>
                <DialogContent>
                    <DialogContentText classes={{root: this.props.classes.marginButtom}}>
                        Currently connected to {this.props.hostUrl}.
                    </DialogContentText>
                    <DialogContentText classes={{root: this.props.classes.marginButtom}}>
                        Version: {this.props.version}
                    </DialogContentText>
                    <DialogContentText classes={{root: this.props.classes.marginButtom}}>
                        Enabled features: {this.props.enabledFeatures.join(", ")}
                    </DialogContentText>
                    <DialogContentText classes={{root: this.props.classes.marginTop}}>
                        Connect to new server:
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Host URL"
                        type="url"
                        value={this.state.newUrl}
                        onChange={this.updateHostUrl}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Secret"
                        type="password"
                        value={this.state.newSecret}
                        onChange={this.updateSecret}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onRequestClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.connect} color="primary">
                        Connect
                    </Button>
                </DialogActions>
            </ResponsiveDialog>
        )
    }
}

export default withStyles(styles)(ConnectionDialog)