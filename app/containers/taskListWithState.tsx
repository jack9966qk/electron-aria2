import { connect } from 'react-redux'
import { RootState } from '../reducer'
import TaskList, { DispatchProps, StoreProps } from '../components/taskList'

function mapStateToProps(state: RootState): StoreProps {
    return {
        tasks: state.server.tasks
    }
}

export default connect(mapStateToProps)(TaskList)