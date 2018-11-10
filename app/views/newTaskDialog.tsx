import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import AriaJsonRPC from '../model/rpc'

const styles = (theme: Theme) => createStyles({
    tabs: {
        marginBottom: theme.spacing.unit * 3
    },
    fileInput: {
        display: "none"
    },
    fileInputButton: {
        width: "100%",
        marginTop: theme.spacing.unit
    }
})

interface ViewProps {
    rpc: AriaJsonRPC
    open: boolean
    onRequestClose: () => void
    classes: any
}

export interface DispatchProps {
    addTask: Function
    addTorrent: Function
}

export interface StoreProps {
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    uri: string | null
    file: File | null
    tabValue: number
}

class NewTaskDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            uri: null,
            file: null, 
            tabValue: 0
        }
    }

    updateTabValue = (value) => {
        this.setState({ tabValue: value })
    }

    updateUri = (event) => {
        this.setState({
            uri: event.target.value
        })
    }

    onAddClicked = () => {
        switch (this.state.tabValue) {
            case 0:
                this.props.addTask(
                    this.props.rpc,
                    this.state.uri)
                break
            case 1:
                this.submitTorrentFile()
                break
            default:
                console.warn("invalid tabValue")
                break
        }
        
        this.props.onRequestClose()
    }

    submitTorrentFile = () => {
        const getBase64 = (file) => new Promise( (res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = () => { res((reader.result as string).split(",")[1]) }
            reader.onerror = (error) => { rej(error) }
        })
         
        getBase64(this.state.file).then( base64 => {
            console.log(base64)
            this.props.addTorrent(this.props.rpc, base64)
            this.props.onRequestClose()
        })
    }

    handleFileSelect = (event) => {
        console.log(event.target.files[0])
        this.setState({ file: event.target.files[0] })   
    }

    render() {
        const { open, onRequestClose, classes } = this.props
        const { tabValue, file } = this.state

        const onChange = (_, value) => { this.updateTabValue(value) }

        const fromUrl = (
            <>
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
            </>
        )

        const fromFile = (
            <>
                <DialogContentText>
                    Choose a torrent file:
                </DialogContentText>
                <input
                    className={classes.fileInput}
                    type="file"
                    id="file-input"
                    onChange={this.handleFileSelect}
                />
                <label htmlFor="file-input">
                    <Button
                        classes={{root: classes.fileInputButton}}
                        variant="contained"
                        color="primary"
                        component="span"
                    >
                        {
                        file === null ?
                            "Select File" :
                            `Selected ${file.name}`
                        }
                    </Button>
                </label>
            </>
        )

        return (
            <Dialog
                open={open}
                onClose={onRequestClose}
                fullWidth={true}
            >
                <DialogTitle>New Task</DialogTitle>
                <DialogContent>
                    <Tabs
                        classes={{root: classes.tabs}}
                        value={tabValue}
                        onChange={onChange}
                        fullWidth
                    >
                        <Tab label="From URL" />
                        <Tab label="From File" />
                    </Tabs>
                    { tabValue === 0 ? fromUrl : "" }
                    { tabValue === 1 ? fromFile : "" }
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

export default withStyles(styles)(NewTaskDialog)