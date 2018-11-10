import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import TextField from '@material-ui/core/TextField'

import { Options, OptionName, optionNames } from '../model/task'

interface ViewProps {
    prevOptions: Options
    onOptionChange: (Options) => void
}

export interface DispatchProps {
}

export interface StoreProps {
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
    newOptions: Options
}

const styles = (theme: Theme) => createStyles({
})

class OptionFields extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newOptions: {...props.prevOptions}
        }
    }

    handleValChange = (event, name) => {
        this.setState({
            newOptions: {
                ...this.props.prevOptions,
                [name]: event.target.value
            }
        }, () => {
            this.props.onOptionChange(this.state.newOptions)
        })
    }

    render() {
        const { newOptions } = this.state

        const textField = (name: OptionName) => {
            return (
                <TextField
                    key={name}
                    margin="dense"
                    id="name"
                    label={name}
                    type="text"
                    value={newOptions[name]}
                    onChange={(e) => { this.handleValChange(e, name) }}
                    variant="filled"
                    fullWidth
                />
            )
        }

        return (
            <>
                { optionNames.map((name) => textField(name)) }
            </>
        )
    }
}

export default withStyles(styles)(OptionFields)