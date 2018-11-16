import { connect } from 'react-redux'
import TaskBasicInfo, { ViewProps, StoreProps, DispatchProps } from '../components/TaskBasicInfo'
import creators from '../creators'
import { RootState } from '../reducer'
import { getName } from '../model/task';

function mapStateToProps(state: RootState, ownProps: ViewProps): StoreProps {
    const task = state.server.tasks.get(ownProps.gid)
    return {
        taskName: getName(task),
        status: task.status,
        totalLength: parseInt(task.totalLength),
        path: task.files[0].path
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(TaskBasicInfo)