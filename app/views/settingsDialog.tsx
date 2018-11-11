import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Paper from '@material-ui/core/Paper'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

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
    dialogContent: {
        paddingTop: theme.spacing.unit * 2,
        backgroundColor: theme.palette.grey[200]
    }
})

interface ViewProps {
    title: string
    open: boolean
    rpc: AriaJsonRPC
    onRequestClose: () => void
    classes: any
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
        const {
            open,
            title,
            options,
            onRequestClose,
            classes
        } = this.props

        return (
            <Dialog
                open={open}
                onClose={onRequestClose}
                fullWidth={true}
                classes={{paper: classes.dialogPaper}}
            >
                <Paper classes={{root: classes.dialogHeaderPaper}}>
                    <DialogTitle>{title}</DialogTitle>
                </Paper>

                <DialogContent classes={{root: classes.dialogContent}}>
                    <OptionFields
                        prevOptions={options}
                        onOptionChange={this.onOptionChange}
                    />
                </DialogContent>
                <Paper classes={{root: classes.dialogHeaderPaper}}>
                    <DialogActions>
                        <Button onClick={onRequestClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.saveSettings} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Paper>
            </Dialog>
        )
    }
}

export default withStyles(styles)(SettingsDialog)