import React from 'React'
import Button from 'material-ui/Button'

import AriaJsonRPC from '../model/rpc'
import NewTaskDialogWithState from './newTaskDialogWithState.jsx'
import TaskListWithState from './taskListWithState.jsx'
import TopBar from './topBar.jsx'
import SideBar from './sideBar.jsx'

export default class Control extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogOpen: false,
            sidebarOpen: true
        }
    }
    
    handleDialogOpen = () => {
        this.setState({ dialogOpen: true })
    }
    
    handleDialogClose = () => {
        this.setState({ dialogOpen: false })
    }

    handleSidebarOpen = () => {
        this.setState({ sidebarOpen: true })
    }

    handleSidebarClose = () => {
        this.setState({ sidebarOpen: false })
    }

    componentDidMount() {
        console.log("Control did mount")
        this.props.setUp(this.props.hostUrl, this.props.token)
    }
    
    render() {
        return (
            <div>
                <TopBar
                    showAddNewTask={this.handleDialogOpen}
                    showMenu={this.handleSidebarOpen}
                    rpc={this.props.rpc}
                    version={this.props.version}
                />
                <SideBar open={this.state.sidebarOpen} onClose={this.handleSidebarClose} />
                <TaskListWithState />
                <NewTaskDialogWithState
                    open={this.state.dialogOpen}
                    onRequestClose={this.handleDialogClose}
                />
            </div>
        )
    }
}
