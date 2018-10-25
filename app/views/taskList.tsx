import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'

import TaskListItem from './taskListItem'
import { filterTasks } from '../model/taskCategory'

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

interface TaskListProps {
    tasks: any[]
    category: string
    classes: any
    rpc: any
    pauseTask: Function
    resumeTask: Function
    deleteTask: Function
    permDeleteTask: Function
    revealFile: Function
}

interface TaskListState {

}

class TaskList extends React.Component<TaskListProps, TaskListState> {
    constructor(props) {
        super(props)
    }

    render() {
        const tasks = filterTasks(this.props.tasks, this.props.category)
        const { root } = this.props.classes
        return (
        <div className={root}>
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
        )
    }
}

export default withStyles(styles)(TaskList)