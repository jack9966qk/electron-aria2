import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import * as React from 'react'
import ResponsiveDialog from './ResponsiveDialog'
import { Server } from '../reducer'


interface ViewProps {
    open: boolean
    defaultUrl: string
    defaultSecret: string
    onRequestConnect: (hostUrl: string, secret: string) => void
    onRequestClose: () => void
}

export interface DispatchProps {
}

export interface StoreProps {
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    hostUrl: string
    secret: string
}

class ConnectionDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            hostUrl: this.props.defaultUrl,
            secret: this.props.defaultSecret
        }
    }

    connect = () => {
        const { hostUrl, secret } = this.state
        this.props.onRequestConnect(hostUrl, secret)
        this.props.onRequestClose()
    }

    updateHostUrl = (hostUrl) => {
        this.setState({ hostUrl })
    }

    updateSecret = (secret) => {
        this.setState({ secret })
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
                    <TextField
                        margin="dense"
                        id="name"
                        label="Host URL"
                        type="url"
                        value={this.state.hostUrl}
                        onChange={this.updateHostUrl}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Secret"
                        type="password"
                        value={this.state.secret}
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

export default ConnectionDialog