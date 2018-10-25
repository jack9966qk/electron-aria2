import * as React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface SettingsDialogProps {
    setDefaultDir: (string) => void
    onRequestClose: () => void
    open: boolean
}

interface SettingsDialogState {
    dir: string
}

class SettingsDialog extends React.Component<SettingsDialogProps, SettingsDialogState> {
    constructor(props) {
        super(props)
        this.state = {
            dir: props.defaultDir
        }
    }

    handleDirInput = (event) => {
        this.setState({
            dir: event.target.value
        })
    }

    saveSettings = () => {
        this.props.setDefaultDir(this.state.dir)
        this.props.onRequestClose()
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onRequestClose}
                fullWidth={true}
            >
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Default download directory:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Download Directory"
                        type="url"
                        value={this.state.dir}
                        onChange={this.handleDirInput}
                        multiline
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onRequestClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.saveSettings} color="primary">
                        Save Settings
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default SettingsDialog