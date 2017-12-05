import React from 'React'
import Button from 'material-ui/Button'
import Snackbar from 'material-ui/Snackbar'

import AriaJsonRPC from '../model/rpc'
import NewTaskDialogWithState from './newTaskDialogWithState.jsx'
import SettingsDialogWithState from './settingsDialogWithState.jsx'
import TaskListWithState from './taskListWithState.jsx'
import TopBar from './topBar.jsx'
import SideBarWithState from './sideBarWithState.jsx'
import TaskCategoryTabsWithState from './taskCategoryTabsWithState.jsx'
import withStyles from 'material-ui/styles/withStyles'
import { ACTIVE, WAITING, COMPLETED, STOPPED, description } from './taskCategory'

const styles = theme => ({
    taskList: {
        [theme.breakpoints.up('sm')]: {
            marginTop: 80
        },
        [theme.breakpoints.down('sm')]: {
            marginTop: 120
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
        this.props.setUp(
            this.props.hostUrl,
            this.props.token,
            this.onRpcResponse,
            this.onRpcError
        )
    }

    componentWillUnmount() {
        console.log("Control will unmount")
        this.props.tearDown(
            this.props.rpc,
            this.onRpcResponse,
            this.onRpcError
        )
    }

    componentWillUpdate = (nextProps) => {
        // if (nextProps.version !== this.props.version &&
        //     nextProps.version !== undefined) {
        //     this.setState({
        //         snackbarOpen: true,
        //         snackbarText: `Connected, version: ${this.props.version}`
        //     })
        // }
    }

    onRpcResponse = (method, args, response) => {
        switch(method) {
            case "aria2.getVersion":
                this.setState({
                    snackbarOpen: true,
                    snackbarText: `Connected, version: ${response.version}`
                })
                break
            case "aria2.unpause":
                this.setState({
                    snackbarOpen: true,
                    snackbarText: `Task unpaused`
                })
                break
            case "aria2.pause":
                this.setState({
                    snackbarOpen: true,
                    snackbarText: `Task paused`
                })
                break
            case "aria2.addUri":
                this.setState({
                    snackbarOpen: true,
                    snackbarText: `Task added`
                })
                break
            default:
                console.log(method)
                console.log(response)
                this.setState({ snackbarOpen: true, snackbarText: `${method.replace("aria2.", "")} succeeded` })
                // this.setState({ snackbarOpen: true, snackbarText: JSON.stringify(response) })
                break
        }
    }

    onRpcError = (method, args, error) => {
        this.setState({ snackbarOpen: true, snackbarText: "Error: " + error.message })
    }
    
    render() {
        const { classes } = this.props
        return (
            <div>
                <TopBar
                    showAddNewTask={this.handleDialogOpen}
                    showMenu={this.handleSidebarOpen}
                    showSettings={this.handleSettingsOpen}
                    title={description[this.state.category]}
                    tabs={<TaskCategoryTabsWithState
                        onCategorySelected={this.handleCategorySelect}
                        category={this.state.category}
                    />}
                />
                <SideBarWithState
                    open={this.state.sidebarOpen}
                    onClose={this.handleSidebarClose}
                    onCategorySelected={this.handleCategorySelect}
                    category={this.state.category}
                />
                <div className={classes.taskList}>
                    <TaskListWithState category={this.state.category} />
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
                    onRequestClose={this.handleSnackbarClose}
                    message={<span>{this.state.snackbarText}</span>}
                />
            </div>
        )
    }
}

export default withStyles(styles)(Control)