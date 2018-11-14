import { createStyles, withStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import * as React from 'react'
import TaskListItemWithState from '../containers/TaskListItemWithState'
import AriaJsonRPC from '../model/rpc'
import { filterTasks, Task, TaskCategory } from '../model/task'


const styles = (theme: Theme) => createStyles({
    root: {
        padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit}px`,
    },
})

interface ViewProps {
    rpc: AriaJsonRPC
    category: TaskCategory
    classes: any
    openContextMenu: (menu: JSX.Element, event: React.MouseEvent) => void
}

export interface DispatchProps {
}

export interface StoreProps {
    tasks: Map<string, Task>
}

type Props =
    ViewProps &
    DispatchProps &
    StoreProps

interface State {
}

class TaskList extends React.Component<Props, State> {
    shouldComponentUpdate(nextProps) {
        return true
    }

    constructor(props) {
        super(props)
    }

    render() {
        const tasks = filterTasks(Array.from(this.props.tasks.values()), this.props.category)
        const { root } = this.props.classes
        return (
            <div className={root}>
                {
                    tasks.map(task =>
                        <TaskListItemWithState
                            rpc={this.props.rpc}
                            key={task.gid}
                            task={task}
                            openContextMenu={this.props.openContextMenu}
                        />
                    )
                }
            </div>
        )
    }
}

export default withStyles(styles)(TaskList)