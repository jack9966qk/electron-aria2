import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import TextField from '@material-ui/core/TextField'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    Options,
    OptionName,
    basicOptionNames,
    httpFtpSftpOptionNames,
    httpOptionNames,
    ftpSftpOptionNames,
    torrentMetalinkOptionNames,
    torrentOptionNames,
    metalinkOptionNames,
    rpcOptionNames,
    otherOptionNames,
    optionDescriptions
} from '../model/options'

const sections = [
    [basicOptionNames, "Basic Options", true],
    [httpFtpSftpOptionNames, "HTTP/FTP/SFTP Options", false],
    [httpOptionNames, "HTTP Specific Options", false],
    [ftpSftpOptionNames, "FTP/SFTP Specific Options", false],
    [torrentMetalinkOptionNames, "Torrent/Metalink Options", false],
    [torrentOptionNames, "Torrent Specific Options", false],
    [metalinkOptionNames, "Metalink Specific Options", false],
    [rpcOptionNames, "RPC Options", false],
    [otherOptionNames, "Other Options", false]
]

const styles = (theme: Theme) => createStyles({
    expansionDetails: {
        // display: "block",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gridRowGap: `${theme.spacing.unit * 0.75}px`,
        gridColumnGap: `${theme.spacing.unit * 1.5}px`
    },
    root: {}
})

interface ViewProps {
    defaultOptions: Options
    onOptionChange: (Options) => void
    classes: any
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
        const label = optionDescriptions[name] !== undefined ?
            `${optionDescriptions[name]} (${name})` : name
        return (
            <TextField
                margin="dense"
                id="name"
                label={label}
                type="text"
                value={value === undefined ? "" : value}
                onChange={this.onChange}
                variant="outlined"
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
                ...this.props.defaultOptions,
                [name]: value
            }
        }, () => {
            this.props.onOptionChange(this.state.newOptions)
        })
    }

    
    render() {
        const { classes } = this.props

        const makeOptionField = (name) => (
            <OptionField
                key={name}
                name={name}
                initialVal={this.props.defaultOptions[name]}
                onChange={(v) => {this.handleValChange(name, v)}}
            />
        )

        const makeSection = (optionNames, description, defaultExpanded) => (
            <ExpansionPanel key={description} defaultExpanded={defaultExpanded}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{description}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{root: classes.expansionDetails}}
                >
                    {optionNames.map(makeOptionField)}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )

        return (
            <div className={classes.root}>
                {
                sections.map(([optionNames, description, defaultExpanded]) =>
                    makeSection(optionNames, description, defaultExpanded))
                }
            </div>
        )
    }
}

export default withStyles(styles)(OptionFields)