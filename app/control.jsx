import React from 'React'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

import AriaJsonRPC from '../model/rpc'
import NewTaskDialogWithState from './newTaskDialogWithState.jsx'
import SettingsDialogWithState from './settingsDialogWithState.jsx'
import TaskListWithState from './taskListWithState.jsx'
import TopBar from './topBar.jsx'
import SideBarWithState from './sideBarWithState.jsx'
import withStyles from 'material-ui/styles/withStyles'
import { ACTIVE, WAITING, COMPLETED, STOPPED } from './taskCategory'

const styles = theme => ({
    taskList: {
        [theme.breakpoints.up('sm')]: {
            marginTop: 80
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 64
        }
    }
})

class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newTaskDialogOpen: false,
            settingsOpen: false,
            sidebarOpen: false,
            snackbarOpen: false,
            category: ACTIVE
        }
    }
    
    handleDialogOpen = () => {
        this.setState({ newTaskDialogOpen: true })
    }
    
    handleDialogClose = () => {
        this.setState({ newTaskDialogOpen: false })
    }

    handleSidebarOpen = () => {
        this.setState({ sidebarOpen: true })
    }

    handleSidebarClose = () => {
        this.setState({ sidebarOpen: false })
    }

    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false })
    }

    handleCategorySelect = (category) => {
        this.setState({ category, sidebarOpen: false })
    }

    handleSettingsOpen = () => {
        this.setState({ settingsOpen: true })  
    }

    handleSettingsClose = () => {
        this.setState({ settingsOpen: false })        
    }

    componentDidMount() {
        console.log("Control did mount")
        this.props.setUp(this.props.hostUrl, this.props.token)
    }

    componentWillUpdate = (nextProps) => {
        if (nextProps.version !== this.props.version &&
            nextProps.version !== undefined) {
            this.setState({ snackbarOpen: true })
        }
    }
    
    render() {
        const { classes } = this.props
        return (
            <div>
                <TopBar
                    showAddNewTask={this.handleDialogOpen}
                    showMenu={this.handleSidebarOpen}
                    showSettings={this.handleSettingsOpen}
                />
                <SideBarWithState
                    open={this.state.sidebarOpen}
                    onClose={this.handleSidebarClose}
                    onCategorySelected={this.handleCategorySelect}
                    category={this.state.category}
                />
                <TaskListWithState
                    className={classes.taskList}
                    category={this.state.category}
                />
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
                    autoHideDuration={2000}
                    onRequestClose={this.handleSnackbarClose}
                    message={<span>Connected, version: {this.props.version}</span>}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Control)