import { connect } from "react-redux"
import TaskList, { DispatchProps, StoreProps } from "../views/taskList"
import { RootState } from "../reducer"

function mapStateToProps(state: RootState): StoreProps {
    return {
        tasks: state.server.tasks
    }
}

export default connect(mapStateToProps)(TaskList)