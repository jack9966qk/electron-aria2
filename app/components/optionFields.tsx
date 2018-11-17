import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import {
    basicOptionNames,
    ftpSftpOptionNames,
    httpFtpSftpOptionNames,
    httpOptionNames,
    metalinkOptionNames,
    optionDescriptions,
    OptionName,
    Options,
    otherOptionNames,
    rpcOptionNames,
    torrentMetalinkOptionNames,
    torrentOptionNames
} from '../model/options'

const sections: [OptionName[], string, boolean][] = [
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
    query: string
}


// styles adapted from https://material-ui.com/demos/expansion-panels/
// "Secondary heading and Columns" example
const sectionStyles = (theme: Theme) => createStyles({
    root: {},
    heading: {
        flexBasis: "50%",
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        marginLeft: theme.spacing.unit * 2,
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    column: {
        flexBasis: '50%',
    },
    expansionDetails: {
        // display: "block",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gridRowGap: `${theme.spacing.unit * 0.75}px`,
        gridColumnGap: `${theme.spacing.unit * 1.5}px`
    },
})

class Section extends React.Component<
    {
        optionNames: string[],
        description: string,
        defaultExpanded: boolean,
        handleValChange: Function,
        defaultOptions: Options,
        query: string
    } & WithStyles<typeof sectionStyles>,
    { renderChildren: boolean }
    > {
    constructor(props) {
        super(props)
        this.state = { renderChildren: props.defaultExpanded }
    }

    onEnter = () => {
        this.setState({ renderChildren: true })
    }

    render() {
        const {
            defaultExpanded,
            description,
            optionNames,
            handleValChange,
            defaultOptions,
            query,
            classes
        } = this.props

        const makeOptionField = (name) => (
            <OptionField
                key={name}
                name={name}
                initialVal={defaultOptions[name]}
                onChange={(v) => { handleValChange(name, v) }}
            />
        )

        const filteredNames = optionNames.filter(n => RegExp(query, "i").test(n))
        const numOptions = filteredNames.length

        return (
            <ExpansionPanel
                key={description}
                defaultExpanded={defaultExpanded}
                CollapseProps={{ onEnter: this.onEnter }}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>
                        {description}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                        {`${numOptions} Option${numOptions < 2 ? "" : "s"}`}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                    classes={{ root: classes.expansionDetails }}
                >
                    {this.state.renderChildren ? filteredNames.map(makeOptionField) : ""}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}
const StyledSection = withStyles(sectionStyles)(Section)

class OptionField extends React.Component<
    { name: OptionName, initialVal: string, onChange: Function },
    { value: string }
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
            newOptions: { ...props.prevOptions },
            query: ""
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

    handleUpdateQuery = (e) => {
        this.setState({ query: e.target.value })
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.root}>
                <TextField
                    margin="dense"
                    id="name"
                    label="Options Filter"
                    type="text"
                    value={this.state.query}
                    onChange={this.handleUpdateQuery}
                    variant="outlined"
                    fullWidth
                />
                {
                    sections.map(([optionNames, description, defaultExpanded]) =>
                        <StyledSection
                            key={description}
                            optionNames={optionNames}
                            description={description}
                            defaultExpanded={defaultExpanded}
                            handleValChange={this.handleValChange}
                            query={this.state.query}
                            defaultOptions={this.props.defaultOptions}
                        />)
                }
            </div>
        )
    }
}

export default withStyles(styles)(OptionFields)