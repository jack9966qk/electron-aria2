import { connect } from "react-redux"

import TaskList from "./taskList.jsx"

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    }
}
 
export default connect(mapStateToProps)(TaskList)