import { connect } from 'react-redux'
import TaskListItem, { DispatchProps } from '../components/TaskListItem'
import creators from '../creators'

function mapDispatchToProps(dispatch): DispatchProps {
    const {
        pauseTask,
        resumeTask,
        deleteTask,
        permDeleteTask,
        revealFile,
        openFile
    } = creators(dispatch)
    return {
        pauseTask,
        resumeTask,
        deleteTask,
        permDeleteTask,
        revealFile,
        openFile
    }
}

export default connect(null, mapDispatchToProps)(TaskListItem)