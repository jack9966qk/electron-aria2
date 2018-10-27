import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'

import TaskListItem from './taskListItem'
import { filterTasks } from '../model/taskCategory'
import AriaJsonRPC from '../model/rpc'

const styles = theme => ({
    root: {
        margin: 10
    },
})

interface ViewProps {
    category: string
    classes: any
}

export interface DispatchProps {
    pauseTask: Function
    resumeTask: Function
    deleteTask: Function
    permDeleteTask: Function
    revealFile: Function
    openFile: Function
}

export interface StoreProps {
    tasks: any[]
    rpc: AriaJsonRPC
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
}

class TaskList extends React.Component<Props, State> {
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