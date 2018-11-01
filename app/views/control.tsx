import * as React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import withStyles from '@material-ui/core/styles/withStyles'
import createStyles from '@material-ui/core/styles/createStyles'

import AriaMessages from '../model/ariaMessages'
import NewTaskDialogWithState from '../containers/newTaskDialogWithState'
import SettingsDialogWithState from '../containers/settingsDialogWithState'
import TaskListWithState from '../containers/taskListWithState'
import TopBar from './topBar'
import SideBarWithState from '../containers/sideBarWithState'
import TaskCategoryTabsWithState from '../containers/taskCategoryTabsWithState'
import { TaskCategory, taskCategoryDescription } from '../model/task'
import AriaJsonRPC from '../model/rpc'
import { Theme } from '@material-ui/core/styles/createMuiTheme'

const styles = (theme: Theme) => createStyles({
    content: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
        gridTemplateColumns: "auto 1fr"
    },
    topBar: {
        zIndex: theme.zIndex.drawer + 1,
        gridColumn: "1 / -1"
    },
    sideBar: {
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    taskList: {
        overflow: "auto",
        [theme.breakpoints.down("xs")]: {
            gridColumn: "1 / -1" // full width in compact view
        }
    },
    toolBar: theme.mixins.toolbar
})

interface ViewProps {
    classes: any
}

export interface DispatchProps {
    connectLocal: (
        onRes: Function,
        onErr: Function,
        onConnErr: () => void,
        ) => void
    connect: (
        url: string,
        secret: string,
        onRes: Function,
        onErr: Function,
        onConnErr: () => void,
        ) => void
    disconnect: (
        rpc: AriaJsonRPC,
        ) => void
    purgeTasks: (AriaJsonRPC) => void
}

export interface StoreProps {
    rpc: AriaJsonRPC
    version: string
    hostUrl: string
    secret: string
}

type Props = ViewProps & DispatchProps & StoreProps

interface State {
    newTaskDialogOpen: boolean
    settingsOpen: boolean
    sidebarOpen: boolean
    snackbarOpen: boolean
    category: TaskCategory
    snackbarText: string
    startedConnecting: boolean
}

class Control extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newTaskDialogOpen: false,
            settingsOpen: false,
            sidebarOpen: false,
            snackbarOpen: false,
            snackbarText: undefined,
            category: TaskCategory.Active,
            startedConnecting: false
        }
    }
    
    handleDialogOpen = () => {
        this.setState({ newTaskDialogOpen: true })
    }
    
    handleDialogClose = () => {
        this.setState({ newTaskDialogOpen: false })
    }

    toggleSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    openSnackbarWith = (text: string) => {
        this.setState({ snackbarOpen: true, snackbarText: text })
    }

    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false })
    }

    handleCategorySelect = (category) => {
        this.setState({ category })
    }

    handleSettingsOpen = () => {
        this.setState({ settingsOpen: true })  
    }

    handleSettingsClose = () => {
        this.setState({ settingsOpen: false })        
    }

    getStatus = () => (
        this.props.rpc !== undefined ?
            "Connected" :
            this.state.startedConnecting ?
            "Connecting" :
            "Disconnected"
    )

    componentDidMount() {
        console.log("Control did mount")
        this.props.connectLocal(
            this.onAriaResponse,
            this.onAriaError,
            this.onConnectionError)
    }

    componentDidUpdate(prevProps: Props) {
        // connect automatically given new url or secret
        if (this.props.hostUrl !== prevProps.hostUrl ||
            this.props.secret !== prevProps.secret) {
            // disconnect old server if exists
            if (this.props.rpc) {
                this.props.disconnect(this.props.rpc)
            }
            // got a new server, connect
            this.props.connect(
                this.props.hostUrl,
                this.props.secret,
                this.onAriaResponse,
                this.onAriaError,
                this.onConnectionError
            )
        }
    }

    componentWillUnmount() {
        console.log("Control will unmount")
        this.props.disconnect(this.props.rpc)
    }

    onAriaResponse = (method, args, response) => {
        const func = AriaMessages[method]
        if (func !== undefined) {
            this.setState({
                snackbarOpen: true,
                snackbarText: func(args, response)
            })
        } else {
            console.log(method)
            console.log(response)
            this.openSnackbarWith(`${method.replace("aria2.", "")} succeeded`)
        }
    }

    onAriaError = (_method, _args, error) => {
        this.openSnackbarWith(`Error: ${error.message}`)
    }

    onConnectionError = () => {
        this.openSnackbarWith(`Failed to connect to ${this.props.hostUrl}`)
    }
    
    render() {
        const { classes } = this.props
        const title = this.getStatus() === "Connected" ?
            taskCategoryDescription[this.state.category] :
            this.getStatus() + "..."
        return (
            <>
                <div className={classes.content}>
                    <TopBar classes={{root: classes.topBar}}
                        showAddNewTask={this.handleDialogOpen}
                        showMenu={this.toggleSidebarOpen}
                        showSettings={this.handleSettingsOpen}
                        title={title}
                        tabs={<TaskCategoryTabsWithState
                            onCategorySelected={this.handleCategorySelect}
                            category={this.state.category}
                        />}
                    />
                    <SideBarWithState
                        open={this.state.sidebarOpen}
                        onCategorySelected={this.handleCategorySelect}
                        category={this.state.category}
                        classes={{root: classes.sideBar}}
                    />
                    <TaskListWithState
                        category={this.state.category}
                        classes={{root: classes.taskList}}
                    />
                </div>

                <NewTaskDialogWithState
                    open={this.state.newTaskDialogOpen}
                    onRequestClose={this.handleDialogClose}
                />
                <SettingsDialogWithState
                    open={this.state.settingsOpen}
                    onRequestClose={this.handleSettingsClose}
                />
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={5000}
                    onClose={this.handleSnackbarClose}
                    message={<span>{this.state.snackbarText}</span>}
                />
            </>
        )
    }
}

export default withStyles(styles)(Control)