import * as React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

interface ViewProps {
    open: boolean
    onRequestClose: () => void
}

export interface DispatchProps {
    addTask: Function
    addTorrent: Function
}

export interface StoreProps {
    rpc: any
    defaultDir: string
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    uri: string
}

class NewTaskDialog extends React.Component<Props, State> {
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
        this.props.addTask(
            this.props.rpc,
            this.state.uri,
            this.props.defaultDir)
        this.props.onRequestClose()
    }

    handleFileSelect = (event) => {
        const getBase64 = (file) => new Promise( (res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => { res((reader.result as string).split(",")[1]) }
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
                onClose={this.props.onRequestClose}
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
                    <DialogContentText style={{marginTop: 30}}>
                    Or choose a torrent file:
                    </DialogContentText>
                    <input
                        style={{display: "none"}}
                        type="file"
                        id="file-input"
                        onChange={this.handleFileSelect}
                    />
                    <label htmlFor="file-input">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{width: "100%", marginTop: 10}}
                        >
                            Select File
                        </Button>
                    </label>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onRequestClose}>
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