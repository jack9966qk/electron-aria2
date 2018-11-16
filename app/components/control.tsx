import Popover from '@material-ui/core/Popover'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import * as Electron from 'electron'
import * as React from 'react'
import ConnectionDialog from './ConnectionDialog'
import StatusBar from './StatusBar'
import TopBar from './TopBar'
import NewTaskDialogWithState from '../containers/NewTaskDialogWithState'
import SettingsDialogWithState from '../containers/SettingsDialogWithState'
import SideBarWithState from '../containers/SideBarWithState'
import TaskCategoryTabsWithState from '../containers/TaskCategoryTabsWithState'
import TaskListWithState from '../containers/TaskListWithState'
import AriaJsonRPC from '../model/rpc'
import {
    TaskCategory,
    taskCategoryDescription
} from '../model/task'
import { Server, Notification } from '../reducer'
import MultiSnackbarWithState from '../containers/MultiSnackbarWithState'
import { compare } from './Compare'
const TopBarMemoized = compare(TopBar)
const SidebarMemoized = compare(SideBarWithState)

const mainFuncs = Electron.remote.require("./mainFuncs.js")

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
        zIndex: theme.zIndex.drawer,
        gridRow: "2 / -1",
        [theme.breakpoints.down("xs")]: {
            display: "none"
        }
    },
    taskList: {
        zIndex: theme.zIndex.drawer - 2,
        overflow: "auto",
        [theme.breakpoints.down("xs")]: {
            gridColumn: "1 / -1" // full width in compact view
        }
    },
    toolBar: theme.mixins.toolbar,
    statusBar: {
        zIndex: theme.zIndex.drawer - 1,
        [theme.breakpoints.down("xs")]: {
            gridColumn: "1 / -1" // full width in compact view
        }
    }
})

interface ViewProps {
    classes: any
    rpc: AriaJsonRPC
    connect: (url: string, secret: string) => void
}

export interface DispatchProps {
    displayNotification: (
        message: Notification["message"],
        type?: Notification["type"]
    ) => void
}

export interface StoreProps {
    server: Server
}

type Props = ViewProps & DispatchProps & StoreProps

interface State {
    newTaskDialogOpen: boolean
    settingsOpen: boolean
    sidebarOpen: boolean
    connectionDialogOpen: boolean
    contextMenuOpen: boolean
    contextMenuPosition: { top: number, left: number }
    contextMenu: JSX.Element | null
    category: TaskCategory
    snackbarText: string | null
}

class Control extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            newTaskDialogOpen: false,
            settingsOpen: false,
            sidebarOpen: false,
            connectionDialogOpen: false,
            contextMenuOpen: false,
            contextMenuPosition: { top: 0, left: 0 },
            contextMenu: null,
            snackbarText: null,
            category: TaskCategory.Active
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

    openConnectionDialog = () => {
        this.setState({ connectionDialogOpen: true })
    }

    closeConnectionDialog = () => {
        this.setState({ connectionDialogOpen: false })
    }

    closeSettings = () => {
        this.setState({ settingsOpen: false })
    }

    toggleSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen })
    }

    onCategorySelected = (category) => {
        this.setState({ category })
    }

    openContextMenu = (menu: JSX.Element, event: React.MouseEvent) => {
        this.setState({
            contextMenuOpen: true,
            contextMenu: menu,
            contextMenuPosition: { top: event.clientY, left: event.clientX }
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

    
    render() {
        const { server, classes } = this.props
        const title = taskCategoryDescription[this.state.category]
        return server === null ? (<></>) : (
            <>
                <div className={classes.content} onMouseUp={this.onMouseUp}>
                    <TopBarMemoized
                        classes={{ root: classes.topBar }}
                        showAddNewTask={this.openDialog}
                        showMenu={this.toggleSidebarOpen}
                        showSettings={this.openSettings}
                        showConnectionDialog={this.openConnectionDialog}
                        title={title}
                        isLocalServer={server.hostUrl === mainFuncs.hostUrl}
                        tabs={<TaskCategoryTabsWithState
                            onCategorySelected={this.onCategorySelected}
                            category={this.state.category}
                        />}
                    />
                    <SidebarMemoized
                        open={this.state.sidebarOpen}
                        onCategorySelected={this.onCategorySelected}
                        category={this.state.category}
                        classes={{ root: classes.sideBar }}
                    />
                    <TaskListWithState
                        rpc={this.props.rpc}
                        category={this.state.category}
                        classes={{ root: classes.taskList }}
                        openContextMenu={this.openContextMenu}
                    />

                    <StatusBar
                        totalDownloadSpeed={parseInt(server.stat.downloadSpeed)}
                        totalUploadSpeed={parseInt(server.stat.uploadSpeed)}
                        classes={{ root: classes.statusBar }}
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

                <ConnectionDialog
                    open={this.state.connectionDialogOpen}
                    defaultUrl={server.hostUrl}
                    defaultSecret={server.secret}
                    onRequestClose={this.closeConnectionDialog}
                    onRequestConnect={this.props.connect}
                />

                <NewTaskDialogWithState
                    rpc={this.props.rpc}
                    open={this.state.newTaskDialogOpen}
                    onRequestClose={this.closeDialog}
                />
                <SettingsDialogWithState
                    title="Global Options"
                    rpc={this.props.rpc}
                    open={this.state.settingsOpen}
                    onRequestClose={this.closeSettings}
                />

                <MultiSnackbarWithState />
            </>
        )
    }
}

export default withStyles(styles)(Control)