import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import OptionFields from './optionFields'
import AriaJsonRPC from '../model/rpc'
import { Options } from '../model/options'

const styles = (theme: Theme) => createStyles({
    dialogPaper: {
        // fixes the issue of no scroll bar of DialogContent
        overflowY: "visible"
    },
    dialogHeaderPaper: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        zIndex: theme.zIndex.modal
    },
    dialogActionsPaper: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        zIndex: theme.zIndex.modal
    },
    tabs: {
    },
    dialogContent: {
        paddingTop: theme.spacing.unit * 1.5,
        backgroundColor: theme.palette.grey[200]
    },
    fileInput: {
        display: "none"
    },
    fileInputButton: {
        width: "100%",
        marginTop: theme.spacing.unit
    },
    optionsText: {
        marginTop: theme.spacing.unit * 2
    },
    optionFields: {
        marginTop: theme.spacing.unit * 2
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
    globalOptions: Options
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    uri: string | null
    file: File | null
    tabValue: number
    options: Options
}

class NewTaskDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            uri: null,
            file: null, 
            tabValue: 0,
            options: {}
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
                    this.state.uri,
                    this.state.options)
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
            this.props.addTorrent(this.props.rpc, base64, this.state.options)
            this.props.onRequestClose()
        })
    }

    handleFileSelect = (event) => {
        console.log(event.target.files[0])
        this.setState({ file: event.target.files[0] })   
    }

    onOptionChange = (options) => {
        this.setState({ options })
    }

    render() {
        const { open, globalOptions, onRequestClose, classes } = this.props
        const { tabValue, file } = this.state

        const onChange = (_, value) => { this.updateTabValue(value) }

        const fromUrl = (
            <>
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
                            "Select Torrent File" :
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
                classes={{paper: classes.dialogPaper}}
            >
                <Paper classes={{root: classes.dialogHeaderPaper}}>
                    <DialogTitle>New Task</DialogTitle>
                    <Tabs
                        classes={{root: classes.tabs}}
                        value={tabValue}
                        onChange={onChange}
                        fullWidth
                    >
                        <Tab label="From URL" />
                        <Tab label="From File" />
                    </Tabs>
                </Paper>
                <DialogContent classes={{root: classes.dialogContent}}>
                    { tabValue === 0 ? fromUrl : "" }
                    { tabValue === 1 ? fromFile : "" }
                    <OptionFields
                        classes={{root: classes.optionFields}}
                        defaultOptions={globalOptions}
                        onOptionChange={this.onOptionChange}
                    />
                </DialogContent>
                <Paper classes={{root: classes.dialogActionsPaper}}>
                    <DialogActions>
                        <Button onClick={this.props.onRequestClose}>
                            Cancel
                        </Button>
                        <Button onClick={this.onAddClicked} color="primary">
                            Add Task
                        </Button>
                    </DialogActions>
                </Paper>
            </Dialog>
        )
    }
}

export default withStyles(styles)(NewTaskDialog)