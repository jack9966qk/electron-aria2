import * as React from 'react'
import Popover from '@material-ui/core/Popover'
import withStyles from '@material-ui/core/styles/withStyles'
import createStyles from '@material-ui/core/styles/createStyles'
import { SnackbarProvider, withSnackbar } from 'notistack'

import AriaMessages from '../model/ariaMessages'
import NewTaskDialogWithState from '../containers/newTaskDialogWithState'
import SettingsDialogWithState from '../containers/settingsDialogWithState'
import TaskListWithState from '../containers/taskListWithState'
import StatusBar from './statusBar'
import TopBar from './topBar'
import SideBarWithState from '../containers/sideBarWithState'
import TaskCategoryTabsWithState from '../containers/taskCategoryTabsWithState'
import { TaskCategory, taskCategoryDescription, getName, Task } from '../model/task'
import AriaJsonRPC from '../model/rpc'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { Server } from '../reducer';

const styles = (theme: Theme) => createStyles({
    content: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        gridTemplateColumns: "auto 1fr"
    },
    topBar: {
        zIndex: theme.zIndex.drawer + 1,
        gridColumn: "1 / -1"
    },
    sideBar: {
        gridRow: "2 / -1",
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
    toolBar: theme.mixins.toolbar,
    snackBar: {
    },
    statusBar: {
        [theme.breakpoints.down("xs")]: {
            gridColumn: "1 / -1" // full width in compact view
        }
    }
})

interface ViewProps {
    classes: any
    enqueueSnackbar: Function
}

export interface DispatchProps {
    connectLocal: (
        onRes: Function,
        onNotif: Function,
        onErr: Function,
        onConnErr: () => void,
        onConnSuccess: (AriaJsonRPC) => void
        ) => void
    connect: (
        url: string,
        secret: string,
        onRes: Function,
        onNotif: Function,
        onErr: Function,
        onConnErr: () => void,
        onConnSuccess: (AriaJsonRPC) => void
        ) => void
    disconnect: (
        rpc: AriaJsonRPC,
        ) => void
    purgeTasks: (AriaJsonRPC) => void
}

export interface StoreProps {
    server: Server
}

type Props = ViewProps & DispatchProps & StoreProps

interface State {
    rpc: AriaJsonRPC | null
    newTaskDialogOpen: boolean
    settingsOpen: boolean
    sidebarOpen: boolean
    contextMenuOpen: boolean
    contextMenuPosition: {top: number, left: number}
    contextMenu: JSX.Element | null
    category: TaskCategory
    snackbarText: string | null
    startedConnecting: boolean
}

class Control extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            rpc: null,
            newTaskDialogOpen: false,
            settingsOpen: false,
            sidebarOpen: false,
            contextMenuOpen: false,
            contextMenuPosition: {top: 0, left: 0},
            contextMenu: null,
            snackbarText: null,
            category: TaskCategory.Active,
            startedConnecting: false
        }
    }
    
    openDialog = () => {
        this.setState({ newTaskDialogOpen: true })
    }
    
    closeDialog = () => {
        this.setState({ newTaskDialogOpen: false })
    }

    openSettings = () => {
        this.setState({ settingsOpen: true })  
    }

    closeSettings = () => {
        this.setState({ settingsOpen: false })        
    }

    toggleSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    openSnackbarWith = (text: string, variant?: string) => {
        this.props.enqueueSnackbar(text, {
            variant: variant ? variant : "default",
            autoHideDuration: 3000,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "center"
            }
        })
    }

    onCategorySelected = (category) => {
        this.setState({ category })
    }

    openContextMenu = (menu: JSX.Element, event: React.MouseEvent) => {
        this.setState({
            contextMenuOpen: true,
            contextMenu: menu,
            contextMenuPosition: {top: event.clientY, left: event.clientX}
        })
    }

    closeContextMenu = () => {
        this.setState({
            contextMenuOpen: false
        })
    }

    onMouseUp = (event: React.MouseEvent) => {
        // close menu if main button pressed (usually left-click)
        if (event.button === 0) {
            this.closeContextMenu()
        }
    }

    getStatus = () => (
        this.state.rpc !== null ?
            "Connected" :
            this.state.startedConnecting ?
            "Connecting" :
            "Disconnected"
    )

    componentDidMount() {
        console.log("Control did mount")
        this.props.connectLocal(
            this.onAriaResponse,
            this.onAriaNotification,
            this.onAriaError,
            this.onConnectionError,
            this.onConnectionSuccess)
    }

    componentDidUpdate(prevProps: Props) {
        // // connect automatically given new url or secret
        // if (this.props.hostUrl !== prevProps.hostUrl ||
        //     this.props.secret !== prevProps.secret) {
        //     // disconnect old server if exists
        //     if (this.props.rpc) {
        //         this.props.disconnect(this.props.rpc)
        //     }
        //     // got a new server, connect
        //     this.props.connect(
        //         this.props.hostUrl,
        //         this.props.secret,
        //         this.onAriaResponse,
        //         this.onAriaNotification,
        //         this.onAriaError,
        //         this.onConnectionError
        //     )
        // }
    }

    componentWillUnmount() {
        console.log("Control will unmount")
        if (this.state.rpc !== null) {
            this.props.disconnect(this.state.rpc)
        }
    }

    onAriaResponse = (method, args, response) => {
        console.log(method)
        console.log(response)
        const func = AriaMessages[method]
        if (func !== undefined) {
            const message = func(args, response)
            if (message !== null) {
                this.openSnackbarWith(message)
            }
        } else {
            this.openSnackbarWith(`${method.replace("aria2.", "")} succeeded`)
        }
    }

    onAriaNotification = (method, response) => {
        console.log(method)
        console.log(response)
        const { gid } = response
        if (!this.props.server.tasks.has(gid)) {
            console.warn(`task with gid ${gid} cannot be found`)
        }
        const task = this.props.server.tasks.get(gid)
        const name = getName(task)
        switch (method) {
            case "aria2.onDownloadStart":
                this.openSnackbarWith(`Task "${name}" started`)
                break
            case "aria2.onDownloadPause":
                this.openSnackbarWith(`Task "${name}" paused`)
                break
            case "aria2.onDownloadStop":
                this.openSnackbarWith(`Task "${name}" stopped`)
                break
            case "aria2.onDownloadComplete":
                this.openSnackbarWith(`Task "${name}" completed`, "success")
                break
            case "aria2.onDownloadError":
                this.openSnackbarWith(`Task "${name}" has error`, "error")
                break
            case "aria2.onBtDownloadComplete":
                this.openSnackbarWith(`Task "${name}" completed`)
                break
            default:
                break
        }
    }

    onAriaError = (_method, _args, error) => {
        this.openSnackbarWith(`Error: ${error.message}`)
    }

    onConnectionSuccess = (rpc) => {
        this.setState({ rpc })
    }

    onConnectionError = () => {
        this.openSnackbarWith(`Failed to connect to ${this.props.server.hostUrl}`)
    }
    
    render() {
        const { server, classes } = this.props
        const title = this.getStatus() === "Connected" ?
            taskCategoryDescription[this.state.category] :
            this.getStatus() + "..."
        return server === null ? (<></>) : (
            <>
                <div className={classes.content} onMouseUp={this.onMouseUp}>
                    <TopBar classes={{root: classes.topBar}}
                        showAddNewTask={this.openDialog}
                        showMenu={this.toggleSidebarOpen}
                        showSettings={this.openSettings}
                        title={title}
                        tabs={<TaskCategoryTabsWithState
                            onCategorySelected={this.onCategorySelected}
                            category={this.state.category}
                        />}
                    />
                    <SideBarWithState
                        open={this.state.sidebarOpen}
                        onCategorySelected={this.onCategorySelected}
                        category={this.state.category}
                        classes={{root: classes.sideBar}}
                    />
                    <TaskListWithState
                        rpc={this.state.rpc}
                        category={this.state.category}
                        classes={{root: classes.taskList}}
                        openContextMenu={this.openContextMenu}
                    />

                    <StatusBar
                        tasks={server.tasks}
                        classes={{root: classes.statusBar}}
                    />

                    <Popover
                        open={this.state.contextMenuOpen}
                        anchorReference="anchorPosition"
                        anchorPosition={this.state.contextMenuPosition}
                        // necessary for event to go through popover before control
                        container={this}
                    >
                        {this.state.contextMenu}
                    </Popover>
                </div>

                <NewTaskDialogWithState
                    rpc={this.state.rpc}
                    open={this.state.newTaskDialogOpen}
                    onRequestClose={this.closeDialog}
                />
                <SettingsDialogWithState
                    title="Global Options"
                    rpc={this.state.rpc}
                    open={this.state.settingsOpen}
                    onRequestClose={this.closeSettings}
                />
            </>
        )
    }
}

const ControlWithSnackbar = withSnackbar(Control)
const ControlWithSnackbarProvider: React.SFC<any> = (props) => (
    <SnackbarProvider maxSnack={3} classes={{
        root: props.classes.snackBar
    }}>
        <ControlWithSnackbar {...props}/>
    </SnackbarProvider>
)

export default withStyles(styles)(ControlWithSnackbarProvider)