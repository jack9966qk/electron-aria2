import { connect } from 'react-redux'
import TaskBasicInfo, { ViewProps, StoreProps, DispatchProps } from '../components/taskContextMenu'
import creators from '../creators'
import { RootState } from '../reducer'

function mapStateToProps(state: RootState, ownProps: ViewProps): StoreProps {
    const task = state.server.tasks.get(ownProps.gid)
    return {
        status: task.status,
        path: task.files[0].path
    }
}

function mapDispatchToProps(dispatch): DispatchProps {
    const {
        pauseTask,
        resumeTask,
        deleteTask,
        permDeleteTask,
        revealFile
    } = creators(dispatch)
    return {
        pauseTask,
        resumeTask,
        deleteTask,
        permDeleteTask,
        revealFile
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskBasicInfo)