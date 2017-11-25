import React from 'React'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'

import TaskListItem from './taskListItem.jsx'

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        // background: theme.palette.background.paper,
    },
})

class TaskList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("task list did mount")
    }

    render() {
        return (
        <div className={this.props.classes.root}>
            {
            this.props.tasks.map(task => <TaskListItem key={task.gid} task={task}/>)
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