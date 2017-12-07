import { connect } from "react-redux"

import TaskCategoryTabs from "../views/taskCategoryTabs.jsx"

function mapStateToProps(state) {
    return {
        tasks: state.tasks
    }
}
  
export default connect(mapStateToProps)(TaskCategoryTabs)