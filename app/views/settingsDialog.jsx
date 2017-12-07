import React from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog'
import Input from 'material-ui/Input'

class SettingsDialog extends React.Component {
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
                onRequestClose={this.props.onRequestClose}
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