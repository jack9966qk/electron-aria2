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


class OptionField extends React.Component<
    {name: OptionName, initialVal: string, onChange: Function},
    {value: string}
> {
    constructor(props) {
        super(props)
        this.state = { value: props.initialVal }
    }

    shouldComponentUpdate(_nextProps, nextState) {
        return (this.state.value !== nextState.value)
    }

    onChange = (e) => {
        const value = e.target.value
        this.setState({ value }, () => {
            this.props.onChange(value)
        })
    }

    render() {
        const { name } = this.props
        const { value } = this.state
        return (
            <TextField
                margin="dense"
                id="name"
                label={name}
                type="text"
                value={value === undefined ? "" : value}
                onChange={this.onChange}
                variant="filled"
                fullWidth
            />
        )
    }
}

class OptionFields extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newOptions: {...props.prevOptions}
        }
    }

    handleValChange = (name, value) => {
        this.setState({
            newOptions: {
                ...this.props.prevOptions,
                [name]: value
            }
        }, () => {
            this.props.onOptionChange(this.state.newOptions)
        })
    }

    render() {
        const { newOptions } = this.state

        return (
            <>
                {
                optionNames.map((name) => (
                    <OptionField
                        key={name}
                        name={name}
                        initialVal={this.props.prevOptions[name]}
                        onChange={(v) => {this.handleValChange(name, v)}}
                    />
                ))
                }
            </>
        )
    }
}

export default withStyles(styles)(OptionFields)