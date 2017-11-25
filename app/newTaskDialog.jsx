import React from 'react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog'

class NewTaskDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            uri: undefined
        }
    }

    updateUri = (event) => {
        this.setState({
            uri: event.target.value
        })
    }

    onAddClicked = () => {
        this.props.addTask(this.props.rpc, this.state.uri, this.props.defaultDir)
        this.props.onRequestClose()
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onRequestClose={this.props.onRequestClose}
                fullWidth={true}
            >
                <DialogTitle>New Task</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Enter task URL below:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Task URL"
                        type="url"
                        onChange={this.updateUri}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onRequestClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.onAddClicked} color="primary">
                        Add Task
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default NewTaskDialog