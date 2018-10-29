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
import { TaskCategory, description } from '../model/taskCategory'
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
    connectOrLaunchLocal: (
        rpc: AriaJsonRPC,
        onRes: Function,
        onErr: Function,
        ) => void
    connect: (
        rpc: AriaJsonRPC,
        onRes: Function,
        onErr: Function,
        onConnErr: Function,
        ) => void
    disconnect: (
        rpc: AriaJsonRPC,
        onRes: Function,
        onErr: Function
        ) => void
    purgeTasks: (AriaJsonRPC) => void
}

export interface StoreProps {
    rpc: AriaJsonRPC
    version: string
    hostUrl: string
    token: string
}

type Props = ViewProps & DispatchProps & StoreProps

interface State {
    newTaskDialogOpen: boolean
    settingsOpen: boolean
    sidebarOpen: boolean
    snackbarOpen: boolean
    category: TaskCategory
    snackbarText: string
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
            category: TaskCategory.Active
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

    componentDidMount() {
        console.log("Control did mount")
        this.props.connectOrLaunchLocal(
            this.props.rpc,
            this.onRpcResponse,
            this.onRpcError)
    }

    componentDidUpdate(prevProps: Props) {
        // connect automatically given a new rpc object
        if (this.props.rpc !== prevProps.rpc) {
            // got a new server, connect
            console.log("componentDidUpdate found a new server, connect")
            this.props.connect(
                this.props.rpc,
                this.onRpcResponse,
                this.onRpcError,
                this.onConnectionError
            )
        }
    }

    componentWillUnmount() {
        console.log("Control will unmount")
        this.props.disconnect(
            this.props.rpc,
            this.onRpcResponse,
            this.onRpcError
        )
    }

    onRpcResponse = (method, args, response) => {
        const func = AriaMessages[method]
        if (func !== undefined) {
            this.setState({
                snackbarOpen: true,
                snackbarText: func(args, response)
            })
        } else {
            console.log(method)
            console.log(response)
            this.setState({
                snackbarOpen: true,
                snackbarText: `${method.replace("aria2.", "")} succeeded`
            })
        }
    }

    onRpcError = (_method, _args, error) => {
        this.setState({ snackbarOpen: true, snackbarText: "Error: " + error.message })
    }

    onConnectionError = () => {
        this.setState({ snackbarOpen: true, snackbarText: "Failed to connect to " + this.props.hostUrl})
    }
    
    render() {
        const { classes } = this.props
        return (
            <>
                <div className={classes.content}>
                    <TopBar classes={{root: classes.topBar}}
                        showAddNewTask={this.handleDialogOpen}
                        showMenu={this.toggleSidebarOpen}
                        showSettings={this.handleSettingsOpen}
                        title={description[this.state.category]}
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