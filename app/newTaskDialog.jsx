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

    handleFileSelect = (event) => {
        const getBase64 = (file) => new Promise( (res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => { res(reader.result.split(",")[1]) }
            reader.onerror = (error) => { rej(error) }
        })
         
        getBase64(event.target.files[0]).then( base64 => {
            console.log(base64)
            this.props.addTorrent(this.props.rpc, base64, this.props.defaultDir)
            this.props.onRequestClose()
        })
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
                        multiline
                        fullWidth
                    />
                    <DialogContentText style={{marginTop: 20, marginBottom: 5}}>
                    Or choose a torrent file:
                    </DialogContentText>
                    <input
                        style={{display: "none"}}
                        type="file"
                        id="file-input"
                        onChange={this.handleFileSelect}
                    />
                    <label htmlFor="file-input">
                        <Button Raised color="primary" component="span">
                            Select File
                        </Button>
                    </label>
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