import * as React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import OptionFields from './optionFields'
import AriaJsonRPC from '../model/rpc'
import { Options } from '../model/task'

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
    newOptions: Options
}

class SettingsDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newOptions: props.options
        }
    }

    onOptionChange = (newOptions: Options) => {
        this.setState({ newOptions })
    }

    saveSettings = () => {
        const { rpc } = this.props
        const { newOptions } = this.state
        this.props.changeOptions(rpc, newOptions)
        this.props.onRequestClose()
    }

    render() {

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onRequestClose}
                fullWidth={true}
            >
                <DialogTitle>{this.props.title}</DialogTitle>
                <DialogContent>
                    <OptionFields
                        prevOptions={this.props.options}
                        onOptionChange={this.onOptionChange}
                    />
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