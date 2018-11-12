import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import OptionFields from './optionFields'
import AriaJsonRPC from '../model/rpc'
import { Options } from '../model/options'
import ResponsiveDialog from './responsiveDialog'

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
    addUris: (
        rpc: AriaJsonRPC,
        uris: string[],
        options: Options) => void
    addFiles: (
        rpc: AriaJsonRPC,
        files: {
            type: "torrent" | "metalink"
            content: string
        }[],
        options: Options) => void
}

export interface StoreProps {
    globalOptions: Options
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    uris: string | null
    files: FileList | null
    tabValue: number
    options: Options
}

class NewTaskDialog extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            uris: null,
            files: null, 
            tabValue: 0,
            options: {}
        }
    }

    componentDidUpdate(prevProps) {
        // clear links and files when dialog closed
        if (prevProps.open && !this.props.open) {
            this.setState({ uris: null, files: null })
        }
    }

    updateTabValue = (value) => {
        this.setState({ tabValue: value })
    }

    updateUri = (event) => {
        this.setState({
            uris: event.target.value
        })
    }

    onAddClicked = () => {
        switch (this.state.tabValue) {
            case 0:
                this.props.addUris(
                    this.props.rpc,
                    this.state.uris.split("\n"),
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
        const getBase64 : (File) => Promise<string> =
            (file) => new Promise( (res, rej) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => { res((reader.result as string).split(",")[1]) }
            reader.onerror = (error) => { rej(error) }
        })

        const extension = (file) => file.name.split(".").pop()

        const validFiles = Array.from(this.state.files)
            .filter((file) => {
                switch (extension(file)) {
                    case "torrent":
                        return true
                        break
                    case "metalink":
                        return true
                        break
                    default:
                        console.warn(`invalid file type: ${extension}`)
                        return false
                        break
                }
            })

        Promise.all(validFiles.map(getBase64)).then((results) => {
            const files = results.map((content, i) => ({
                content: content,
                type: extension(validFiles[i])
            }))
            this.props.addFiles(this.props.rpc, files, this.state.options)
        })
    }

    handleFileSelect = (event) => {
        this.setState({ files: event.target.files })   
    }

    onOptionChange = (options) => {
        this.setState({ options })
    }

    render() {
        const { open, globalOptions, onRequestClose, classes } = this.props
        const { tabValue, files } = this.state

        const onChange = (_, value) => { this.updateTabValue(value) }

        const fromUrl = (
            <>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Task URL"
                    type="text"
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
                    accept=".torrent,.metalink"
                    multiple
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
                        files === null ?
                            "Select Torrent File" :
                            files.length > 1 ?
                                `Selected ${files.length} files` :
                                `Selected ${files[0].name}`
                        }
                    </Button>
                </label>
            </>
        )

        return (
            <ResponsiveDialog
                open={open}
                onClose={onRequestClose}
                fullWidth={true}
                classes={{paper: classes.dialogPaper}}
                disableRestoreFocus // for tooltips: https://bit.ly/2z4suAV
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
            </ResponsiveDialog>
        )
    }
}

export default withStyles(styles)(NewTaskDialog)