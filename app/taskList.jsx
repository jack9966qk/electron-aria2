import React from 'React'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

import TaskListItem from './taskListItem.jsx'
import { filterTasks } from './taskCategory'

const styles = theme => ({
    root: {
        // width: '100%',
        // margin: 10
        maxWidth: 800,
        marginLeft: 'auto',
        marginRight: 'auto',
        // background: theme.palette.background.paper,
    },
})

class TaskList extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const tasks = filterTasks(this.props.tasks, this.props.category)
        return (
        <div className={this.props.classes.root} {...this.props}>
            {
            tasks.map(task =>
                <TaskListItem
                    key={task.gid}
                    task={task}
                    handlePauseTask={() => {
                        this.props.pauseTask(this.props.rpc, task.gid)
                    }}
                    handleResumeTask={() => {
                        this.props.resumeTask(this.props.rpc, task.gid)
                    }}
                    handleDeleteTask={() => {
                        this.props.deleteTask(this.props.rpc, task.gid)
                    }}
                    handlePermDeleteTask={() => {
                        this.props.permDeleteTask(this.props.rpc, task.gid)
                    }}
                    handleRevealFile={() => {
                        this.props.revealFile(task.files[0].path)
                    }}
                />
            )
            }
        </div>
        // <List className={this.props.classes.root}>
        //     {
        //     this.props.tasks.map(task => <TaskListItem key={task.gid} task={task}/>)
        //     }
        // </List>
        )
    }
}

export default withStyles(styles)(TaskList)