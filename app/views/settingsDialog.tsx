import * as React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { Options, OptionName, optionNames } from '../model/task'
import AriaJsonRPC from '../model/rpc';

interface ViewProps {
    title: string
    open: boolean
    rpc: AriaJsonRPC
    onRequestClose: () => void
}

export interface DispatchProps {
    changeOptions: (rpc: AriaJsonRPC, options: Options) => void
}

export interface StoreProps {
    options: Options
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    // avoid using full options for better performance
    // record only the key-value pairs that have changed
    optionChanges: Options
}

class SettingsDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            optionChanges: {}
        }
    }

    handleValChange = (event, name) => {
        this.setState({
            optionChanges: {
                ...this.state.optionChanges,
                [name]: event.target.value
            }
        })
    }

    saveSettings = () => {
        const { rpc, options } = this.props
        const { optionChanges } = this.state
        this.props.changeOptions(rpc, {...options, ...optionChanges})
        this.props.onRequestClose()
    }

    render() {
        const { options } = this.props
        const { optionChanges } = this.state

        const textField = (name: OptionName) => {
            return (
                <TextField
                    key={name}
                    margin="dense"
                    id="name"
                    label={name}
                    type="text"
                    value={
                        optionChanges[name] !== undefined ?
                        optionChanges[name] : options[name]
                    }
                    onChange={(e) => { this.handleValChange(e, name) }}
                    variant="filled"
                    fullWidth
                />
            )
        }

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onRequestClose}
                fullWidth={true}
            >
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>
                    { optionNames.map((name) => textField(name)) }
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onRequestClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.saveSettings} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default SettingsDialog